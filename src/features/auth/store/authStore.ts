import * as LocalAuthentication from "expo-local-authentication";
import { create } from "zustand";

import { db } from "@infra/database/client";
import { settings } from "@infra/database/schema";
import { hashForStorage, verifyHash } from "@infra/crypto/cryptoService";
import { BackHandler } from "react-native";

// ─── Setting keys ─────────────────────────────────────────────────────────────

const KEY_PHRASE_HASH = "passphrase_hash";
const KEY_KEY_HASH = "passkey_hash";
const KEY_SETUP_DONE = "setup_complete";
const KEY_EULA_ACCEPTED = "eula_accepted";
const KEY_BIOMETRIC_ENABLED = "biometric_mode";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

export type BiometricType = "fingerprint" | "facial" | "iris" | "none";

export interface BiometricInfo {
  available: boolean;
  enrolled: boolean;
  types: BiometricType[];
}

export type BiometricAuthResult =
  | "success"
  | "fallback"
  | "failed"
  | "unavailable";

interface AuthState {
  // ── State ──────────────────────────────────────────────────────────────────
  status: AuthStatus;
  isSetupComplete: boolean;
  isEulaAccepted: boolean;
  isBiometricEnabled: boolean;
  /** PassKey held in memory only — cleared on logout. Never persisted. */
  passKey: string | null;

  // ── Queries ────────────────────────────────────────────────────────────────
  checkSetupStatus: () => Promise<void>;
  getBiometricInfo: () => Promise<BiometricInfo>;
  checkIsEulaAccepted: () => boolean;

  // ── Setup ──────────────────────────────────────────────────────────────────
  acceptEula: () => Promise<void>;
  /**
   * Saves hashed passPhrase + passKey to settings table.
   * passPhrase is a text passphrase (login only, never encrypts data).
   * passKey is a numeric 4-6 digit PIN used for AES-256-CTR encryption.
   */
  setupCredentials: (passPhrase: string, passKey: string) => Promise<void>;

  // ── Biometrics ────────────────────────────────────────────────────────────
  enableBiometrics: () => Promise<boolean>;
  disableBiometrics: () => Promise<void>;
  /**
   * Authenticate using device biometrics (Face ID / fingerprint / device PIN).
   * On success, the caller must still provide the passKey to decrypt data.
   * The passKey is NOT stored — biometrics replaces the passPhrase only.
   */
  authenticateWithBiometrics: () => Promise<BiometricAuthResult>;

  // ── Auth ───────────────────────────────────────────────────────────────────
  login: (passPhrase: string, passKey: string) => Promise<boolean>;
  /** Biometric login — verifies identity then accepts passKey directly. */
  loginWithBiometrics: (passKey: string) => Promise<boolean>;
  logout: () => void;
  getPassKey: () => string | null;

  // ── Credential changes ────────────────────────────────────────────────────
  changePassPhrase: (
    oldPassPhrase: string,
    newPassPhrase: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassKey: (
    oldPassPhrase: string,
    oldPassKey: string,
    newPassKey: string,
    reEncryptFn: (oldKey: string, newKey: string) => Promise<void>,
  ) => Promise<{ success: boolean; error?: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const upsertSetting = async (key: string, value: string): Promise<void> => {
  const now = new Date();
  await db
    .insert(settings)
    .values({ key, value, updatedAt: now })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: now },
    });
};

const loadSettingsMap = async (): Promise<Record<string, string>> => {
  const rows = await db.select().from(settings);
  const map: Record<string, string> = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });
  return map;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  isSetupComplete: false,
  isEulaAccepted: false,
  isBiometricEnabled: false,
  passKey: null,

  // ── checkSetupStatus ───────────────────────────────────────────────────────
  checkSetupStatus: async () => {
    set({ status: "checking" });
    try {
      const map = await loadSettingsMap();
      set({
        isSetupComplete: map[KEY_SETUP_DONE] === "true",
        isEulaAccepted: map[KEY_EULA_ACCEPTED] === "true",
        isBiometricEnabled: map[KEY_BIOMETRIC_ENABLED] === "true",
        status:
          map[KEY_SETUP_DONE] === "true" || map[KEY_EULA_ACCEPTED] === "true"
            ? "unauthenticated"
            : "idle",
      });
    } catch {
      set({ status: "unauthenticated" });
    }
  },

  // ── getBiometricInfo ───────────────────────────────────────────────────────
  getBiometricInfo: async (): Promise<BiometricInfo> => {
    try {
      const available = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const rawTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      const typeMap: Record<number, BiometricType> = {
        [LocalAuthentication.AuthenticationType.FINGERPRINT]: "fingerprint",
        [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: "facial",
        [LocalAuthentication.AuthenticationType.IRIS]: "iris",
      };

      const types = rawTypes
        .map((t) => typeMap[t])
        .filter((t): t is BiometricType => Boolean(t));

      return { available, enrolled, types };
    } catch {
      return { available: false, enrolled: false, types: [] };
    }
  },

  checkIsEulaAccepted: () => get().isEulaAccepted,

  // ── acceptEula ─────────────────────────────────────────────────────────────
  acceptEula: async () => {
    await upsertSetting(KEY_EULA_ACCEPTED, "true");
    set({ isEulaAccepted: true });
  },

  // ── setupCredentials ───────────────────────────────────────────────────────
  setupCredentials: async (passPhrase, passKey) => {
    const phraseHash = hashForStorage(passPhrase);
    const keyHash = hashForStorage(passKey);
    await upsertSetting(KEY_PHRASE_HASH, phraseHash);
    await upsertSetting(KEY_KEY_HASH, keyHash);
    await upsertSetting(KEY_SETUP_DONE, "true");
    set({ isSetupComplete: true, status: "authenticated", passKey });
  },

  // ── enableBiometrics ───────────────────────────────────────────────────────
  enableBiometrics: async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm to enable biometric unlock",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    if (!result.success) return false;
    await upsertSetting(KEY_BIOMETRIC_ENABLED, "true");
    set({ isBiometricEnabled: true });
    return true;
  },

  // ── disableBiometrics ──────────────────────────────────────────────────────
  disableBiometrics: async () => {
    await upsertSetting(KEY_BIOMETRIC_ENABLED, "false");
    set({ isBiometricEnabled: false });
  },

  // ── authenticateWithBiometrics ─────────────────────────────────────────────
  authenticateWithBiometrics: async (): Promise<BiometricAuthResult> => {
    try {
      const info = await get().getBiometricInfo();
      if (!info.available || !info.enrolled) return "unavailable";

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock nkrypt",
        cancelLabel: "Use PIN",
        disableDeviceFallback: false,
        fallbackLabel: "Use device PIN",
      });

      if (result.success) return "success";
      // error property tells us if user dismissed vs fallback
      return "fallback";
    } catch {
      return "failed";
    }
  },

  // ── login (PIN + passKey) ──────────────────────────────────────────────────
  login: async (passPhrase, passKey): Promise<boolean> => {
    try {
      const map = await loadSettingsMap();
      const phraseOk = verifyHash(passPhrase, map[KEY_PHRASE_HASH] ?? "");
      const keyOk = verifyHash(passKey, map[KEY_KEY_HASH] ?? "");
      if (!phraseOk || !keyOk) return false;
      set({ status: "authenticated", passKey });
      return true;
    } catch {
      return false;
    }
  },

  // ── loginWithBiometrics ───────────────────────────────────────────────────
  // Biometrics replaces PIN verification only.
  // passKey is still required because it's what actually decrypts files.
  loginWithBiometrics: async (passKey): Promise<boolean> => {
    try {
      const map = await loadSettingsMap();
      if (map[KEY_BIOMETRIC_ENABLED] !== "true") return false;

      const bioResult = await get().authenticateWithBiometrics();
      if (bioResult !== "success") return false;

      // Verify passKey independently — it's still required for decryption
      const keyOk = verifyHash(passKey, map[KEY_KEY_HASH] ?? "");
      if (!keyOk) return false;

      set({ status: "authenticated", passKey });
      return true;
    } catch {
      return false;
    }
  },

  // ── logout ─────────────────────────────────────────────────────────────────
  logout: () => {
    set({ status: "unauthenticated", passKey: null });
    BackHandler.exitApp();
  },
  getPassKey: () => get().passKey,

  // ── changePassPhrase ───────────────────────────────────────────────────────
  // Pass phrase is text (not numeric). No re-encryption needed — passPhrase
  // is never used for file encryption.
  changePassPhrase: async (oldPassPhrase, newPassPhrase) => {
    try {
      const map = await loadSettingsMap();
      if (!verifyHash(oldPassPhrase, map[KEY_PHRASE_HASH] ?? "")) {
        return { success: false, error: "Current Pass Phrase is incorrect" };
      }
      if (oldPassPhrase === newPassPhrase) {
        return { success: false, error: "New Pass Phrase must be different" };
      }
      await upsertSetting(KEY_PHRASE_HASH, hashForStorage(newPassPhrase));
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  },

  // ── changePassKey ──────────────────────────────────────────────────────────
  // PassKey IS the encryption key. Changing it requires re-encrypting all files.
  // Verification requires BOTH old passPhrase AND old passKey (like original cred.ts).
  changePassKey: async (oldPassPhrase, oldPassKey, newPassKey, reEncryptFn) => {
    try {
      const map = await loadSettingsMap();

      const phraseOk = verifyHash(oldPassPhrase, map[KEY_PHRASE_HASH] ?? "");
      const keyOk = verifyHash(oldPassKey, map[KEY_KEY_HASH] ?? "");

      if (!phraseOk || !keyOk) {
        return { success: false, error: "Current credentials are incorrect" };
      }
      if (oldPassKey === newPassKey) {
        return { success: false, error: "New Pass Key must be different" };
      }

      // Re-encrypt all files with new key (matches original cred.ts behaviour)
      await reEncryptFn(oldPassKey, newPassKey);

      // Persist new key hash
      await upsertSetting(KEY_KEY_HASH, hashForStorage(newPassKey));

      // Update in-memory key for the current session
      set({ passKey: newPassKey });

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  },
}));
