import React from "react";
import { Animated } from "react-native";
import { Text, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing } from "@shared/constants/design";

interface ErrorBannerProps {
  message: string;
  shakeAnim?: Animated.Value;
}

export const ErrorBanner = ({ message, shakeAnim }: ErrorBannerProps) => {
  const colors = useColors();
  const inner = (
    <XStack
      alignItems="center"
      gap={Spacing.sm}
      padding={Spacing.md}
      borderRadius={Radius.md}
      borderWidth={1}
      backgroundColor={colors.error + "18"}
      borderColor={colors.error + "40"}
    >
      <BxIcon name="bx-error-circle" size={16} color={colors.error} />
      <Text color={colors.error} fontSize={13} flex={1}>
        {message}
      </Text>
    </XStack>
  );
  if (shakeAnim) {
    return (
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        {inner}
      </Animated.View>
    );
  }
  return inner;
};
