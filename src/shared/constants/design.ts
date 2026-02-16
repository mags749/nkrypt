// ─── Design Tokens ───────────────────────────────────────────────────────────
// nkrypt v2 — refined minimal, monochromatic with sharp accents

export const Colors = {
  light: {
    // Backgrounds
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceSecondary: "#F4F4F5",
    surfaceElevated: "#FFFFFF",

    // Text
    textPrimary: "#0A0A0B",
    textSecondary: "#71717A",
    textTertiary: "#A1A1AA",
    textInverse: "#FFFFFF",

    // Border
    border: "#E4E4E7",
    borderStrong: "#D4D4D8",

    // Brand / Action
    accent: "#0A0A0B",
    accentForeground: "#FFFFFF",

    // States
    error: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",

    // Category badges
    categoryGeneral: "#71717A",
    categoryApps: "#3B82F6",
    categoryBank: "#22C55E",
    categoryCard: "#A855F7",
    categoryShopping: "#F97316",
    categorySocial: "#EC4899",

    // UI
    overlay: "rgba(0,0,0,0.4)",
    separator: "#E4E4E7",
  },

  dark: {
    // Backgrounds
    background: "#09090B",
    surface: "#18181B",
    surfaceSecondary: "#27272A",
    surfaceElevated: "#1C1C1F",

    // Text
    textPrimary: "#FAFAFA",
    textSecondary: "#A1A1AA",
    textTertiary: "#71717A",
    textInverse: "#0A0A0B",

    // Border
    border: "#27272A",
    borderStrong: "#3F3F46",

    // Brand / Action
    accent: "#FAFAFA",
    accentForeground: "#09090B",

    // States
    error: "#F87171",
    success: "#4ADE80",
    warning: "#FCD34D",

    // Category badges
    categoryGeneral: "#A1A1AA",
    categoryApps: "#60A5FA",
    categoryBank: "#4ADE80",
    categoryCard: "#C084FC",
    categoryShopping: "#FB923C",
    categorySocial: "#F472B6",

    // UI
    overlay: "rgba(0,0,0,0.65)",
    separator: "#27272A",
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  // Display — used for screen titles, splash
  displayLarge: {
    fontFamily: "System",
    fontSize: 48,
    fontWeight: "300" as const,
    letterSpacing: -1.5,
    lineHeight: 56,
  },
  displayMedium: {
    fontFamily: "System",
    fontSize: 36,
    fontWeight: "300" as const,
    letterSpacing: -1,
    lineHeight: 44,
  },

  // Headings
  headingXL: {
    fontSize: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  headingLG: {
    fontSize: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  headingMD: {
    fontSize: 18,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
    lineHeight: 26,
  },

  // Body
  bodyLG: {
    fontSize: 17,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 26,
  },
  bodyMD: {
    fontSize: 15,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  bodySM: {
    fontSize: 13,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 18,
  },

  // Labels — uppercase spaced
  labelLG: {
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 1.2,
    lineHeight: 16,
  },
  labelMD: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 1.0,
    lineHeight: 14,
  },
  labelSM: {
    fontSize: 10,
    fontWeight: "500" as const,
    letterSpacing: 0.8,
    lineHeight: 12,
  },

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
} as const;

export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;
