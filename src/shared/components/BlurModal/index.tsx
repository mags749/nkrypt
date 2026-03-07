import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Dialog, YStack } from "tamagui";

import { Radius, Spacing } from "@shared/constants/design";
import { useColors } from "@context/providers/themeStore";

export const BlurModal = ({
  visible,
  onDismiss,
  children,
  position = "flex-end",
}: BlurModalProps) => {
  const colors = useColors();

  return (
    <Dialog
      modal={false}
      open={visible}
      onOpenChange={(open) => !open && onDismiss()}
    >
      <Dialog.Portal>
        {Platform.OS === "android" && (
          <YStack backgroundColor="rgba(0, 0, 0, 0.72)" fullscreen />
        )}
        {/* 1. The Blur Overlay */}
        <Dialog.Overlay
          key="overlay"
          transition="fast"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          onPress={onDismiss}
          // We make the background transparent so the BlurView is visible
          backgroundColor="transparent"
          // Ensure it fills the screenapp
          style={StyleSheet.absoluteFill}
        ></Dialog.Overlay>

        {/* 2. The Content Box */}
        <Dialog.Content
          bordered
          elevate
          key="content"
          transition={["fast", { opacity: { overshootClamping: true } }]}
          enterStyle={{ x: 0, y: 15, opacity: 0, scale: 0.95 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          // Styling from your original component
          br={Radius.xl}
          p={Spacing["2xl"]}
          backgroundColor={colors.surfaceElevated}
          width="90%"
          maxWidth={450}
          alignSelf="center"
        >
          <YStack>{children}</YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
