import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@features/auth/store/authStore";

export const SessionGuard = () => {
  const router = useRouter();
  const segments = useSegments();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    const inProtected =
      segments[0] === "folders" ||
      segments[0] === "settings" ||
      segments[0] === "modals";

    if (status === "unauthenticated" && inProtected) {
      router.replace("/auth");
    }
  }, [status, segments, router]);

  return null;
};
