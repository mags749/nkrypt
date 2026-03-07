import React from "react";
import { ActivityIndicator } from "react-native";
import { Dialog, Text, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Radius, Shadow, Spacing } from "@shared/constants/design";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({
  visible,
  message = "Processing…",
}: LoadingOverlayProps) => {
  const colors = useColors();

  return (
    <Dialog open={visible} modal>
      <Dialog.Portal>
        <Dialog.Overlay
          transition="fast"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0,0,0,0.45)"
        />
        <Dialog.Content
          transition="fast"
          enterStyle={{ opacity: 0, scale: 0.92 }}
          exitStyle={{ opacity: 0, scale: 0.92 }}
          backgroundColor={colors.surface}
          borderRadius={Radius.xl}
          paddingVertical={Spacing["3xl"]}
          paddingHorizontal={Spacing["4xl"]}
          alignItems="center"
          minWidth={160}
          unstyled
          elevate
          style={Shadow.xl}
        >
          <YStack alignItems="center" gap={Spacing.lg}>
            <ActivityIndicator size="large" color={colors.textPrimary} />
            <Text color={colors.textSecondary} fontSize={15} textAlign="center">
              {message}
            </Text>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export const InlineSpinner = ({ color }: { color: string }) => (
  <ActivityIndicator size="small" color={color} />
);
