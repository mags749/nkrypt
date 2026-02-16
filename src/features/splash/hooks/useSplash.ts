import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useRouter } from "expo-router";

import { useAuthStore } from "@features/auth/store/authStore";
import { useThemeStore } from "@context/providers/themeStore";

export const useSplash = () => {
  const router = useRouter();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { checkSetupStatus, isSetupComplete, isEulaAccepted, status } =
    useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rot0 = useRef(new Animated.Value(0)).current;
  const rot1 = useRef(new Animated.Value(0)).current;
  const rot2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    void checkSetupStatus();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      delay: 300,
      useNativeDriver: true,
    }).start();

    const loop = (anim: Animated.Value, duration: number, reverse: boolean) =>
      Animated.loop(
        Animated.timing(anim, {
          toValue: reverse ? -360 : 360,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );

    const a = loop(rot0, 20000, false);
    const b = loop(rot1, 14000, true);
    const c = loop(rot2, 9000, false);
    a.start();
    b.start();
    c.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, []);

  useEffect(() => {
    if (status !== "checking" && status !== "idle") {
      const t = setTimeout(() => {
        if (!isEulaAccepted) router.replace("/auth/eula");
        else if (!isSetupComplete) router.replace("/auth/setup");
        else router.replace("/auth");
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [status, isEulaAccepted, isSetupComplete]);

  return { fadeAnim, rot0, rot1, rot2, toggleTheme };
};
