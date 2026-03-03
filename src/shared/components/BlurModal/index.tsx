import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Dialog } from "tamagui";

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
        <Dialog.Overlay
          backgroundColor="rgba(0,0,0,0.5)" // Semi-transparent black
          opacity={0.2}
          animateOnly={["transform", "opacity"]}
          transition={[
            "fast",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          transition="fast"
          enterStyle={{ opacity: 0, scale: 0.95, y: 10 }}
          exitStyle={{ opacity: 0, scale: 0.95, y: 10 }}
          // Layout styling
          background={colors.background}
          br={Radius.xl}
          p={Spacing["2xl"]}
          width="90%"
          maxWidth={450}
          alignSelf="center"
          style={{
            marginBottom: position === "flex-end" ? Spacing["3xl"] : "auto",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            {children}
          </KeyboardAvoidingView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
