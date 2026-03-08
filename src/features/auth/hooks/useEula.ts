import { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { useAuthStore } from "@features/auth/store/authStore";

export const useEula = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const state = navigation.getState();
  const { acceptEula, isSetupComplete, isEulaAccepted } = useAuthStore();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!agreed) {
      setIsLoading(true);
      if (isEulaAccepted && !isSetupComplete) {
        router.replace("/auth/setup");
      } else if (isEulaAccepted && isSetupComplete) {
        if (router.canGoBack()) router.back();
        else router.replace("/settings");
      }
      return;
    }
    setIsLoading(true);
    await acceptEula();
    router.replace("/auth/setup");
  };

  return {
    agreed: agreed,
    isEulaAccepted,
    setAgreed,
    isLoading,
    handleAccept,
  };
};
