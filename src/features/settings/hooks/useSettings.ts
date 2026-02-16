import { useEffect, useState } from "react";
import { Alert } from "react-native";
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

  useEffect(() => {
    void getBiometricInfo().then(setBioInfo);
  }, [getBiometricInfo]);

  const onToggleBiometrics = async () => {
    if (isBiometricEnabled) {
      await disableBiometrics();
    } else {
      const ok = await enableBiometrics();
      if (!ok)
        Alert.alert("Biometrics Failed", "Could not enable biometric unlock.");
    }
  };

  const onLockVault = () => {
    Alert.alert(
      "Lock Vault",
      "You will be returned to the login screen. Your data remains encrypted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Lock",
          onPress: () => {
            logout();
            router.replace("/auth");
          },
        },
      ],
    );
  };

  const onWipeData = () => {
    Alert.alert(
      "Wipe All Data",
      "This permanently deletes ALL folders, files, and credentials. Cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe Everything",
          style: "destructive",
          onPress: async () => {
            setLoadingMsg("Wiping data…");
            setIsLoading(true);
            await new Promise<void>((r) => setTimeout(r, 600));
            logout();
            setIsLoading(false);
            router.replace("/auth/setup");
          },
        },
      ],
    );
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
  };
};
