import aesjs from "aes-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CryptResult {
  success: true;
  data: string;
}

export interface CryptError {
  success: false;
  error: string;
}

// ─── Key preparation ──────────────────────────────────────────────────────────
// Pads/truncates passKey to exactly 32 bytes for AES-256.
// Matches original createCipher('aes-256-cbc', key) key handling.

function prepareKey(passKey: string): Uint8Array {
  const keyBytes = aesjs.utils.utf8.toBytes(passKey);
  const key32 = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key32[i] = keyBytes[i % keyBytes.length];
  }
  return key32;
}

// ─── Encrypt ──────────────────────────────────────────────────────────────────
// AES-256-CTR, output: hex string (matches original 'hex' encoding)

export function encrypt(
  data: string,
  passKey: string,
): CryptResult | CryptError {
  try {
    const key = prepareKey(passKey);
    const textBytes = aesjs.utils.utf8.toBytes(data);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(1));
    const encryptedBytes = aesCtr.encrypt(textBytes);
    return { success: true, data: aesjs.utils.hex.fromBytes(encryptedBytes) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Encryption failed",
    };
  }
}

// ─── Decrypt ──────────────────────────────────────────────────────────────────
// AES-256-CTR is symmetric — same operation decrypts

export function decrypt(
  hexData: string,
  passKey: string,
): CryptResult | CryptError {
  try {
    const key = prepareKey(passKey);
    const encryptedBytes = aesjs.utils.hex.toBytes(hexData);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(1));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return { success: true, data: aesjs.utils.utf8.fromBytes(decryptedBytes) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Decryption failed",
    };
  }
}

// ─── Lightweight hash for passPhrase verification ─────────────────────────────
// No PBKDF2/salt complexity. We encrypt a fixed sentinel with the value as key.
// This is verification-only — passPhrase is never used for file encryption.

const SENTINEL = "nkrypt::verify::2025";

export function hashForStorage(value: string): string {
  const result = encrypt(SENTINEL, value);
  return result.success ? result.data : "";
}

export function verifyHash(value: string, storedHash: string): boolean {
  if (!value || !storedHash) return false;
  return hashForStorage(value) === storedHash;
}
