import { createAnimations } from "@tamagui/animations-react-native";
import { createInterFont } from "@tamagui/font-inter";
import { shorthands } from "@tamagui/shorthands";
import {
  themes as tamaguiThemes,
  tokens as tamaguiTokens,
} from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

// ─── Animations ───────────────────────────────────────────────────────────────

const animations = createAnimations({
  fast: { type: "spring", damping: 20, mass: 1.2, stiffness: 250 },
  medium: { type: "spring", damping: 10, mass: 0.9, stiffness: 100 },
  slow: { type: "spring", damping: 20, mass: 1.5, stiffness: 60 },
});

// ─── Fonts ────────────────────────────────────────────────────────────────────

const headingFont = createInterFont({
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 20,
    8: 22,
    9: 26,
    10: 28,
    11: 32,
    12: 36,
  },
  transform: { 6: "uppercase", 7: "none" },
  weight: { 6: "400", 7: "700" },
  color: { 6: "$colorFocus", 7: "$color" },
  letterSpacing: { 5: 2, 6: -0.5, 7: -0.5, 8: -0.5, 9: -0.5, 10: -0.5 },
  face: { 700: { normal: "InterBold" }, 400: { normal: "Inter" } },
});

const bodyFont = createInterFont(
  {
    face: { 700: { normal: "InterBold" }, 400: { normal: "Inter" } },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.5 + 2),
  },
);

// ─── Tokens ───────────────────────────────────────────────────────────────────
// Mirror nkrypt design tokens as Tamagui tokens

const tokens = createTokens({
  size: {
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 6,
    1: 8,
    1.5: 12,
    2: 16,
    2.5: 20,
    3: 24,
    4: 32,
    5: 40,
    6: 48,
    7: 64,
    true: 16,
  },
  space: {
    0: 0,
    0.25: 2,
    0.5: 4,
    0.75: 6,
    1: 8,
    1.5: 12,
    2: 16,
    2.5: 20,
    3: 24,
    4: 32,
    5: 40,
    6: 48,
    7: 64,
    "-0.25": -2,
    "-0.5": -4,
    "-0.75": -6,
    "-1": -8,
    "-1.5": -12,
    "-2": -16,
    true: 16,
  },
  radius: {
    0: 0,
    1: 6,
    2: 10,
    3: 14,
    4: 20,
    5: 28,
    6: 9999,
    true: 10,
  },
  zIndex: { 0: 0, 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 },
  color: {
    // Light
    lightBackground: "#FAFAFA",
    lightSurface: "#FFFFFF",
    lightSurfaceSecondary: "#F4F4F5",
    lightTextPrimary: "#0A0A0B",
    lightTextSecondary: "#71717A",
    lightTextTertiary: "#A1A1AA",
    lightBorder: "#E4E4E7",
    lightAccent: "#0A0A0B",
    lightAccentFg: "#FFFFFF",
    lightError: "#EF4444",
    lightSuccess: "#22C55E",
    lightWarning: "#F59E0B",
    lightSeparator: "#E4E4E7",
    // Dark
    darkBackground: "#09090B",
    darkSurface: "#18181B",
    darkSurfaceSecondary: "#27272A",
    darkTextPrimary: "#FAFAFA",
    darkTextSecondary: "#A1A1AA",
    darkTextTertiary: "#71717A",
    darkBorder: "#27272A",
    darkAccent: "#FAFAFA",
    darkAccentFg: "#09090B",
    darkError: "#F87171",
    darkSuccess: "#4ADE80",
    darkWarning: "#FCD34D",
    darkSeparator: "#27272A",
  },
});

// ─── Themes ───────────────────────────────────────────────────────────────────

const lightTheme = {
  background: "#FAFAFA",
  backgroundHover: "#F4F4F5",
  backgroundPress: "#E4E4E7",
  backgroundFocus: "#F4F4F5",
  backgroundStrong: "#FFFFFF",
  backgroundTransparent: "rgba(0,0,0,0)",
  color: "#0A0A0B",
  colorHover: "#27272A",
  colorPress: "#3F3F46",
  colorFocus: "#0A0A0B",
  colorTransparent: "rgba(10,10,11,0)",
  borderColor: "#E4E4E7",
  borderColorHover: "#D4D4D8",
  borderColorFocus: "#A1A1AA",
  borderColorPress: "#71717A",
  placeholderColor: "#A1A1AA",
  shadowColor: "#000",
  shadowColorHover: "#000",
  // nkrypt-specific
  surface: "#FFFFFF",
  surfaceSecondary: "#F4F4F5",
  textPrimary: "#0A0A0B",
  textSecondary: "#71717A",
  textTertiary: "#A1A1AA",
  accent: "#0A0A0B",
  accentForeground: "#FFFFFF",
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  separator: "#E4E4E7",
};

const darkTheme = {
  background: "#09090B",
  backgroundHover: "#18181B",
  backgroundPress: "#27272A",
  backgroundFocus: "#18181B",
  backgroundStrong: "#18181B",
  backgroundTransparent: "rgba(0,0,0,0)",
  color: "#FAFAFA",
  colorHover: "#F4F4F5",
  colorPress: "#E4E4E7",
  colorFocus: "#FAFAFA",
  colorTransparent: "rgba(250,250,250,0)",
  borderColor: "#27272A",
  borderColorHover: "#3F3F46",
  borderColorFocus: "#71717A",
  borderColorPress: "#A1A1AA",
  placeholderColor: "#71717A",
  shadowColor: "#000",
  shadowColorHover: "#000",
  // nkrypt-specific
  surface: "#18181B",
  surfaceSecondary: "#27272A",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textTertiary: "#71717A",
  accent: "#FAFAFA",
  accentForeground: "#09090B",
  error: "#F87171",
  success: "#4ADE80",
  warning: "#FCD34D",
  separator: "#27272A",
};

// ─── Config ───────────────────────────────────────────────────────────────────

const config = createTamagui({
  animations,
  defaultTheme: "light",
  shouldAddPrefersColorTheme: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  tokens,
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1650 },
    xxl: { minWidth: 1651 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  },
});

export type Conf = typeof config;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
