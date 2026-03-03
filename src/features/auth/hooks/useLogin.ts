import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";

import {
  useAuthStore,
  type BiometricInfo,
} from "@features/auth/store/authStore";
import { PASSKEY_MIN_LENGTH } from "@shared/components/PassKeyInput";

export const useLogin = () => {
  const router = useRouter();
  const {
    login,
    loginWithBiometrics,
    isBiometricEnabled,
    getBiometricInfo,
    authenticateWithBiometrics,
    logout,
    status,
  } = useAuthStore();

  const [passPhrase, setPassPhrase] = useState("");
  const [showPassPhrase, setShowPassPhrase] = useState(false);
  const [passKey, setPassKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Verifying credentials…");
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [bioVerified, setBioVerified] = useState(false);
  const [bioInfo, setBioInfo] = useState<BiometricInfo>({
    available: false,
    enrolled: false,
    types: [],
  });

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 7,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -7,
        duration: 55,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  useEffect(() => {
    void getBiometricInfo().then(setBioInfo);
  }, [getBiometricInfo]);

  // Auto-logout if session expires (status drops to unauthenticated while on this screen)
  useEffect(() => {
    if (status === "unauthenticated") {
      setPassPhrase("");
      setPassKey("");
      setBioVerified(false);
      setError(null);
    }
  }, [status]);

  const handleBiometricPrompt = useCallback(async () => {
    setLoadingMsg("Verifying identity…");
    const result = await authenticateWithBiometrics();
    if (result === "success") {
      setBioVerified(true);
      setError(null);
    } else if (result === "unavailable") {
      setError("Biometrics unavailable. Enter your Pass Phrase.");
    }
  }, [authenticateWithBiometrics]);

  useEffect(() => {
    if (isBiometricEnabled) void handleBiometricPrompt();
  }, [isBiometricEnabled, handleBiometricPrompt]);

  const handleLogin = useCallback(async () => {
    if (passKey.length < PASSKEY_MIN_LENGTH) {
      setError(`Pass Key must be ${PASSKEY_MIN_LENGTH}–6 digits`);
      shake();
      return;
    }
    if (!bioVerified && !passPhrase.trim()) {
      setError("Pass Phrase is required");
      shake();
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingMsg("Verifying credentials…");

    const success = bioVerified
      ? await loginWithBiometrics(passKey)
      : await login(passPhrase, passKey);

    if (success) {
      router.replace("/folders");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setIsLoading(false);
      setPassKey("");
      setBioVerified(false);
      setError(
        next >= 3
          ? `${next} failed attempts. Double-check your credentials.`
          : "Incorrect credentials. Try again.",
      );
      shake();
    }
  }, [
    passKey,
    passPhrase,
    bioVerified,
    attempts,
    login,
    loginWithBiometrics,
    router,
    shake,
  ]);

  return {
    passPhrase,
    setPassPhrase,
    showPassPhrase,
    setShowPassPhrase,
    passKey,
    setPassKey,
    isLoading,
    loadingMsg,
    error,
    setError,
    bioVerified,
    bioInfo,
    isBiometricEnabled,
    shakeAnim,
    handleLogin,
    handleBiometricPrompt,
  };
};
