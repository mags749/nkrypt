import { useState } from "react";
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

  const onBack = () => {
    if (step === "new") setStep("verify");
    else router.back();
  };

  const onVerify = () => {
    const e: Record<string, string> = {};
    if (!passPhrase.trim() || passPhrase.length < 4)
      e.passPhrase = "Enter your current Pass Phrase";
    if (currentKey.length < PASSKEY_MIN_LENGTH)
      e.currentKey = `Enter your current Pass Key (${PASSKEY_MIN_LENGTH}–6 digits)`;
    setErrors(e);
    if (Object.keys(e).length === 0) setStep("new");
  };

  const onSave = async () => {
    const e: Record<string, string> = {};
    if (newKey.length < PASSKEY_MIN_LENGTH)
      e.newKey = `Minimum ${PASSKEY_MIN_LENGTH} digits required`;
    else if (parseInt(newKey, 10) > PASSKEY_MAX_VALUE)
      e.newKey = `Max value is ${PASSKEY_MAX_VALUE}`;
    if (newKey !== newKeyConfirm) e.newKeyConfirm = "Pass Keys do not match";
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
    if (result.success) router.back();
    else {
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
    onBack,
    onVerify,
    onSave,
  };
};
