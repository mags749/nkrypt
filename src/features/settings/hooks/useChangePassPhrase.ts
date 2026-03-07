import { useState } from "react";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@features/auth/store/authStore";

export const useChangePassPhrase = () => {
  const router = useRouter();
  const { changePassPhrase } = useAuthStore();
  const [step, setStep] = useState<"verify" | "new" | "confirm">("verify");
  const [oldPhrase, setOldPhrase] = useState("");
  const [newPhrase, setNewPhrase] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  const onBack = () => {
    if (step === "verify") router.back();
    else if (step === "new") setStep("verify");
    else setStep("new");
    setError(null);
  };

  const onVerify = async () => {
    if (!oldPhrase.trim() || oldPhrase.length < 4) {
      setError("Enter your current Pass Phrase (min. 4 characters)");
      return;
    }

    // Verify against stored hash before advancing
    setIsLoading(true);
    const { db } = await import("@infra/database/client");
    const { settings } = await import("@infra/database/schema");
    const { verifyHash } = await import("@infra/crypto/cryptoService");

    const rows = await db.select().from(settings);
    const map: Record<string, string> = {};
    rows.forEach((r) => {
      map[r.key] = r.value;
    });

    const phraseOk = verifyHash(oldPhrase, map["passphrase_hash"] ?? "");
    setIsLoading(false);

    if (!phraseOk) {
      const next = verifyAttempts + 1;
      setVerifyAttempts(next);
      setOldPhrase("");

      if (next >= 3) {
        setError("Too many failed attempts. Closing app for security.");
        setTimeout(() => BackHandler.exitApp(), 1800);
        return;
      }
      const remaining = 3 - next;
      setError(
        `Incorrect Pass Phrase. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      );
      return;
    }

    setVerifyAttempts(0);
    setError(null);
    setStep("new");
  };

  const onNew = () => {
    if (!newPhrase.trim() || newPhrase.length < 4) {
      setError("Minimum 4 characters");
      return;
    }
    if (newPhrase === oldPhrase) {
      setError("New Pass Phrase must be different from current");
      return;
    }
    setError(null);
    setStep("confirm");
  };

  const onConfirm = async () => {
    if (newPhrase !== confirmPhrase) {
      setError("Pass Phrases do not match");
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await changePassPhrase(oldPhrase, newPhrase);
    setIsLoading(false);
    if (result.success) {
      router.back();
    } else {
      setError(result.error ?? "Failed to update Pass Phrase");
      setStep("verify");
      setOldPhrase("");
      setNewPhrase("");
      setConfirmPhrase("");
    }
  };

  const currentPhrase =
    step === "verify" ? oldPhrase : step === "new" ? newPhrase : confirmPhrase;
  const currentSetter =
    step === "verify"
      ? setOldPhrase
      : step === "new"
        ? setNewPhrase
        : setConfirmPhrase;

  const primaryLabel =
    step === "verify"
      ? "Continue"
      : step === "new"
        ? "Next"
        : "Save New Pass Phrase";

  const onPrimary =
    step === "verify"
      ? () => void onVerify()
      : step === "new"
        ? onNew
        : () => void onConfirm();

  return {
    step,
    currentPhrase,
    currentSetter,
    showPhrase,
    setShowPhrase,
    isLoading,
    error,
    setError,
    verifyAttempts,
    primaryLabel,
    onPrimary,
    onBack,
  };
};
