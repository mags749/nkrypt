import { BlurView } from "expo-blur";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Radius, Shadow, Spacing } from "@shared/constants/design";
import { useColors } from "@context/providers/themeStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlurModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  /** Controls how far up the dialog sits from the bottom. Default: 'flex-end' */
  position?: "center" | "flex-end";
}

// ─── BlurModal ────────────────────────────────────────────────────────────────
// A modal with a live blurred background that pushes up with the keyboard.
// Uses expo-blur's BlurView on iOS for a native glass effect.
// Falls back to a dark semi-transparent overlay on Android.

export const BlurModal = ({
  visible,
  onDismiss,
  children,
  position = "flex-end",
}: BlurModalProps) => {
  const colors = useColors();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      {/* Blur backdrop — tapping it dismisses */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onDismiss}
        style={StyleSheet.absoluteFillObject}
      >
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={55}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <View
            style={[StyleSheet.absoluteFillObject, styles.androidBackdrop]}
          />
        )}
      </TouchableOpacity>

      {/* Dialog — does NOT dismiss on tap */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.avoidingView, { justifyContent: position }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.dialog,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              Shadow.xl,
            ]}
          >
            {children}
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  androidBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  avoidingView: {
    flex: 1,
    padding: Spacing["2xl"],
    paddingBottom: Spacing["3xl"],
  },
  dialog: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing["2xl"],
    paddingTop: Spacing["3xl"],
  },
});
