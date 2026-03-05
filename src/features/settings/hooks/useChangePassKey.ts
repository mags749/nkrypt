import { useState } from "react";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@features/auth/store/authStore";
import { reEncryptAllFiles } from "@features/files/store/filesStore";
import {
  PASSKEY_MIN_LENGTH,
  PASSKEY_MAX_VALUE,
} from "@shared/components/PassKeyInput";

export const useChangePassKey = () => {
  const router = useRouter();
  const { changePassKey } = useAuthStore();
  const [step, setStep] = useState<"verify" | "new">("verify");
  const [passPhrase, setPassPhrase] = useState("");
  const [showPassPhrase, setShowPassPhrase] = useState(false);
  const [currentKey, setCurrentKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newKeyConfirm, setNewKeyConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  const onBack = () => {
    if (step === "new") setStep("verify");
    else router.back();
  };

  const onVerify = async () => {
    // Client-side format checks first
    const e: Record<string, string> = {};
    if (!passPhrase.trim() || passPhrase.length < 4)
      e.passPhrase = "Enter your current Pass Phrase";
    if (currentKey.length < PASSKEY_MIN_LENGTH)
      e.currentKey = `Enter your current Pass Key (${PASSKEY_MIN_LENGTH}–6 digits)`;
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    // Verify credentials against stored hashes via authStore
    setIsLoading(true);
    // We reuse changePassKey with the same key to do a dry-run verification.
    // Instead, we call a lightweight check through verifyHash directly.
    const { db } = await import("@infra/database/client");
    const { settings } = await import("@infra/database/schema");
    const { verifyHash } = await import("@infra/crypto/cryptoService");

    const rows = await db.select().from(settings);
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });

    const phraseOk = verifyHash(passPhrase, map["passphrase_hash"] ?? "");
    const keyOk = verifyHash(currentKey, map["passkey_hash"] ?? "");
    setIsLoading(false);

    if (!phraseOk || !keyOk) {
      const next = verifyAttempts + 1;
      setVerifyAttempts(next);
      if (next >= 3) {
        setErrors({ general: "Too many failed attempts. Closing app for security." });
        setTimeout(() => BackHandler.exitApp(), 1800);
        return;
      }
      const remaining = 3 - next;
      setErrors({
        general: `Incorrect credentials. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        ...((!phraseOk) ? { passPhrase: "Incorrect Pass Phrase" } : {}),
        ...((!keyOk) ? { currentKey: "Incorrect Pass Key" } : {}),
      });
      setPassPhrase("");
      setCurrentKey("");
      return;
    }

    setVerifyAttempts(0);
    setErrors({});
    setStep("new");
  };

  const onSave = async () => {
    const e: Record<string, string> = {};
    if (newKey.length < PASSKEY_MIN_LENGTH)
      e.newKey = `Minimum ${PASSKEY_MIN_LENGTH} digits required`;
    else if (parseInt(newKey, 10) > PASSKEY_MAX_VALUE)
      e.newKey = `Max value is ${PASSKEY_MAX_VALUE}`;
    if (newKey !== newKeyConfirm) e.newKeyConfirm = "Pass Keys do not match";
    if (newKey === currentKey) e.newKey = "New Pass Key must be different from current";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    setErrors({});
    const result = await changePassKey(
      passPhrase,
      currentKey,
      newKey,
      reEncryptAllFiles,
    );
    setIsLoading(false);
    if (result.success) {
      router.back();
    } else {
      setErrors({ general: result.error ?? "Failed to update Pass Key" });
      if (result.error?.includes("incorrect")) {
        setStep("verify");
        setPassPhrase("");
        setCurrentKey("");
        setNewKey("");
        setNewKeyConfirm("");
      }
    }
  };

  return {
    step,
    passPhrase,
    setPassPhrase,
    showPassPhrase,
    setShowPassPhrase,
    currentKey,
    setCurrentKey,
    newKey,
    setNewKey,
    newKeyConfirm,
    setNewKeyConfirm,
    isLoading,
    errors,
    verifyAttempts,
    onBack,
    onVerify: () => void onVerify(),
    onSave: () => void onSave(),
  };
};
