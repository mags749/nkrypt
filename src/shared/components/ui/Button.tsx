import React from "react";
import { ActivityIndicator } from "react-native";
import { Text, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing } from "@shared/constants/design";

interface ButtonProps {
  label: string;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export const Button = ({
  label,
  variant = "primary",
  size = "lg",
  loading = false,
  loadingLabel,
  fullWidth = false,
  onPress,
  disabled,
  style,
}: ButtonProps) => {
  const colors = useColors();

  const bgColor =
    variant === "primary"
      ? colors.accent
      : variant === "danger"
        ? colors.error
        : "transparent";

  const textColor =
    variant === "primary" || variant === "danger"
      ? colors.accentForeground
      : colors.textPrimary;

  const height = size === "lg" ? 54 : size === "md" ? 46 : 38;

  return (
    <XStack
      onPress={disabled || loading ? undefined : onPress}
      alignItems="center"
      justifyContent="center"
      height={height}
      borderRadius={Radius.lg}
      backgroundColor={bgColor}
      paddingHorizontal={Spacing["2xl"]}
      opacity={disabled && !loading ? 0.45 : 1}
      width={fullWidth ? "100%" : undefined}
      borderWidth={variant === "ghost" ? 1 : 0}
      borderColor={variant === "ghost" ? colors.border : undefined}
      pressStyle={{ opacity: 0.75 }}
      style={style}
    >
      {loading ? (
        <XStack gap={Spacing.sm} alignItems="center">
          <ActivityIndicator color={textColor} size="small" />
          {loadingLabel && (
            <Text
              color={textColor}
              fontSize={12}
              fontWeight="600"
              letterSpacing={1.2}
            >
              {loadingLabel.toUpperCase()}
            </Text>
          )}
        </XStack>
      ) : (
        <Text
          color={textColor}
          fontSize={12}
          fontWeight="600"
          letterSpacing={1.2}
        >
          {label.toUpperCase()}
        </Text>
      )}
    </XStack>
  );
};
