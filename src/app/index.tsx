import React from "react";
import { useSplash } from "@features/splash/hooks/useSplash";
import { SplashView } from "@features/splash/views/SplashView";

export default function SplashScreen() {
  const { fadeAnim, rot0, rot1, rot2, toggleTheme } = useSplash();
  return (
    <SplashView
      fadeAnim={fadeAnim}
      rot0={rot0}
      rot1={rot1}
      rot2={rot2}
      onToggleTheme={toggleTheme}
    />
  );
}
