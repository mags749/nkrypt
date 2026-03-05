import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  useAuthStore,
  type BiometricInfo,
} from "@features/auth/store/authStore";
import { useThemeStore } from "@context/providers/themeStore";

export const useSettings = () => {
  const router = useRouter();
  const isDark = useThemeStore((s) => s.isDark);
  const { toggleTheme } = useThemeStore();
  const {
    logout,
    enableBiometrics,
    disableBiometrics,
    isBiometricEnabled,
    getBiometricInfo,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [bioInfo, setBioInfo] = useState<BiometricInfo>({
    available: false,
    enrolled: false,
    types: [],
  });

  // Dialog state
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [wipeDialogOpen, setWipeDialogOpen] = useState(false);
  const [biometricErrorVisible, setBiometricErrorVisible] = useState(false);

  useEffect(() => {
    void getBiometricInfo().then(setBioInfo);
  }, [getBiometricInfo]);

  const onToggleBiometrics = async () => {
    if (isBiometricEnabled) {
      await disableBiometrics();
    } else {
      const ok = await enableBiometrics();
      if (!ok) setBiometricErrorVisible(true);
    }
  };

  const onLockVault = () => setLockDialogOpen(true);

  const onConfirmLock = () => {
    setLockDialogOpen(false);
    logout();
    router.replace("/auth");
  };

  const onWipeData = () => setWipeDialogOpen(true);

  const onConfirmWipe = async () => {
    setWipeDialogOpen(false);
    setLoadingMsg("Wiping data…");
    setIsLoading(true);
    await new Promise<void>((r) => setTimeout(r, 600));
    logout();
    setIsLoading(false);
    router.replace("/auth/setup");
  };

  return {
    isDark,
    toggleTheme,
    isLoading,
    loadingMsg,
    bioInfo,
    isBiometricEnabled,
    onToggleBiometrics,
    onLockVault,
    onWipeData,
    onChangePin: () => router.push("/settings/change-passphrase"),
    onChangePassKey: () => router.push("/settings/change-passkey"),
    onCategories: () => router.push("/settings/categories"),
    onEula: () => router.push("/auth/eula"),
    onBack: () => router.back(),
    // Dialog state
    lockDialogOpen,
    setLockDialogOpen,
    onConfirmLock,
    wipeDialogOpen,
    setWipeDialogOpen,
    onConfirmWipe,
    biometricErrorVisible,
    setBiometricErrorVisible,
  };
};
