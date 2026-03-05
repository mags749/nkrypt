import React from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

import { Radius, Spacing } from "@shared/constants/design";
import { useColors } from "@context/providers/themeStore";
import { useThemeStore } from "@context/providers/themeStore";

interface BlurModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  position?: "flex-end" | "center";
}

export const BlurModal = ({
  visible,
  onDismiss,
  children,
  position = "flex-end",
}: BlurModalProps) => {
  const colors = useColors();
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      {/* Full-screen BlurView behind everything */}
      <BlurView
        style={StyleSheet.absoluteFill}
        intensity={50}
        tint={isDark ? "dark" : "light"}
        experimentalBlurMethod="dimezisBlurView"
      />

      {/* Semi-transparent dark scrim on top of blur */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isDark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.25)" },
        ]}
      />

      {/* Dismiss tap area */}
      <View
        style={[styles.backdrop]}
        onTouchEnd={(e) => {
          // Only dismiss if tapping the backdrop directly (not the card)
          if (e.target === e.currentTarget) onDismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[
            styles.positioner,
            position === "flex-end" ? styles.bottom : styles.center,
          ]}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surfaceElevated },
            ]}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  positioner: {
    width: "100%",
    alignItems: "center",
  },
  bottom: {
    justifyContent: "flex-end",
    marginTop: "auto",
  },
  center: {
    justifyContent: "center",
    flex: 1,
  },
  card: {
    width: "90%",
    maxWidth: 450,
    borderRadius: Radius.xl,
    padding: Spacing["2xl"],
    // Bottom spacing when anchored to bottom
    marginBottom: Spacing["3xl"],
    // Shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
});
