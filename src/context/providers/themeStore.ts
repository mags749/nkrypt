import { create } from "zustand";
import { useColorScheme } from "react-native";
import { Colors } from "@shared/constants/design";
import type { AppTheme } from "@shared/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThemeState {
  theme: AppTheme;
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

// ─── Theme Store ──────────────────────────────────────────────────────────────

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  isDark: false,
  colors: Colors.light,

  toggleTheme: () => {
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      return {
        theme: next,
        isDark: next === "dark",
        colors: Colors[next],
      };
    });
  },

  setTheme: (theme: AppTheme) => {
    set({
      theme,
      isDark: theme === "dark",
      colors: Colors[theme],
    });
  },
}));

// ─── Hook: use theme colors ───────────────────────────────────────────────────

export function useColors() {
  return useThemeStore((state) => state.colors);
}

export function useIsDark() {
  return useThemeStore((state) => state.isDark);
}
