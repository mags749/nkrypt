import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@features/auth/store/authStore";

export const useEula = () => {
  const router = useRouter();
  const { acceptEula } = useAuthStore();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!agreed) return;
    setIsLoading(true);
    await acceptEula();
    router.replace("/auth/setup");
  };

  return { agreed, setAgreed, isLoading, handleAccept };
};
