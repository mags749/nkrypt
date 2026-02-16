import { useState } from "react";
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

  const onBack = () => {
    if (step === "verify") router.back();
    else if (step === "new") setStep("verify");
    else setStep("new");
    setError(null);
  };

  const onVerify = () => {
    if (!oldPhrase.trim() || oldPhrase.length < 4) {
      setError("Enter your current Pass Phrase (min. 4 characters)");
      return;
    }
    setError(null);
    setStep("new");
  };

  const onNew = () => {
    if (!newPhrase.trim() || newPhrase.length < 4) {
      setError("Minimum 4 characters");
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
    if (result.success) router.back();
    else {
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
      ? onVerify
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
    primaryLabel,
    onPrimary,
    onBack,
  };
};
