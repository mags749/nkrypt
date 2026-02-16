import { useRef, useState } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@features/auth/store/authStore";
import { PASSKEY_MIN_LENGTH, PASSKEY_MAX_VALUE } from "@shared/components/PassKeyInput";

export const useSetup = () => {
  const router = useRouter();
  const { setupCredentials } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Pass Phrase (text)
  const [passPhrase, setPassPhrase] = useState("");
  const [passPhraseConfirm, setPassPhraseConfirm] = useState("");
  const [showPassPhrase, setShowPassPhrase] = useState(false);

  // Pass Key (numeric)
  const [passKey, setPassKey] = useState("");
  const [passKeyConfirm, setPassKeyConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const progressAnim = useRef(new Animated.Value(0)).current;

  const advanceTo = (next: 1 | 2 | 3 | 4) => {
    Animated.timing(progressAnim, {
      toValue: (next - 1) / 3,
      duration: 350,
      useNativeDriver: false,
    }).start();
    setStep(next);
  };

  // ── Step 1: validate passphrase text ───────────────────────────────────────
  const handleStep1 = () => {
    if (!passPhrase.trim() || passPhrase.length < 4) {
      setErrors({ passPhrase: "Minimum 4 characters required" });
      return;
    }
    setErrors({});
    advanceTo(2);
  };

  // ── Step 2: confirm passphrase ─────────────────────────────────────────────
  const handleStep2 = () => {
    if (passPhrase !== passPhraseConfirm) {
      setErrors({ passPhraseConfirm: "Pass Phrases do not match" });
      return;
    }
    setErrors({});
    advanceTo(3);
  };

  // ── Step 3: validate passkey numeric ───────────────────────────────────────
  const handleStep3 = () => {
    if (passKey.length < PASSKEY_MIN_LENGTH) {
      setErrors({ passKey: `Minimum ${PASSKEY_MIN_LENGTH} digits required` });
      return;
    }
    const numeric = parseInt(passKey, 10);
    if (numeric > PASSKEY_MAX_VALUE) {
      setErrors({ passKey: `Max value is ${PASSKEY_MAX_VALUE}` });
      return;
    }
    setErrors({});
    advanceTo(4);
  };

  // ── Step 4: confirm passkey & create vault ─────────────────────────────────
  const handleSetup = async () => {
    if (passKey !== passKeyConfirm) {
      setErrors({ passKeyConfirm: "Pass Keys do not match" });
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await setupCredentials(passPhrase, passKey);
      router.replace("/folders");
    } catch {
      setErrors({ general: "Setup failed. Please try again." });
      setIsLoading(false);
    }
  };

  return {
    step,
    passPhrase,
    setPassPhrase,
    passPhraseConfirm,
    setPassPhraseConfirm,
    showPassPhrase,
    setShowPassPhrase,
    passKey,
    setPassKey,
    passKeyConfirm,
    setPassKeyConfirm,
    isLoading,
    errors,
    progressAnim,
    handleStep1,
    handleStep2,
    handleStep3,
    handleSetup,
  };
};
