import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing, Typography } from "@shared/constants/design";

interface ErrorBannerProps {
  message: string;
  shakeAnim?: Animated.Value;
}

export const ErrorBanner = ({ message, shakeAnim }: ErrorBannerProps) => {
  const colors = useColors();
  const inner = (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.error + "18",
          borderColor: colors.error + "40",
        },
      ]}
    >
      <BxIcon name="bx-error-circle" size={16} color={colors.error} />
      <Text style={[styles.text, { color: colors.error }]}>{message}</Text>
    </View>
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

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  text: { ...Typography.bodySM, flex: 1 },
});
