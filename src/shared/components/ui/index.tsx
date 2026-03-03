import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  type TextInputProps,
} from "react-native";
import {
  Button as TButton,
  Input,
  Label,
  Separator as TSeparator,
  SizableText,
  XStack,
  YStack,
  styled,
  Text,
  View,
} from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing, Typography } from "@shared/constants/design";

// ─── Button ───────────────────────────────────────────────────────────────────

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

// ─── InputField ───────────────────────────────────────────────────────────────

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const InputField = forwardRef<RNTextInput, InputFieldProps>(
  ({ label, error, hint, style, ...props }, ref) => {
    const colors = useColors();

    return (
      <YStack marginBottom={Spacing.xl}>
        {label && (
          <Text
            color={colors.textTertiary}
            fontSize={11}
            fontWeight="600"
            letterSpacing={1.0}
            marginBottom={Spacing.sm}
          >
            {label.toUpperCase()}
          </Text>
        )}
        <RNTextInput
          ref={ref}
          style={[
            {
              color: colors.textPrimary,
              fontSize: 17,
              paddingVertical: Spacing.sm,
              paddingHorizontal: 0,
              borderBottomWidth: 1,
              borderBottomColor: error ? colors.error : colors.border,
            },
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {error ? (
          <Text color={colors.error} fontSize={12} marginTop={Spacing.xs}>
            {error}
          </Text>
        ) : hint ? (
          <Text
            color={colors.textTertiary}
            fontSize={12}
            marginTop={Spacing.xs}
          >
            {hint}
          </Text>
        ) : null}
      </YStack>
    );
  },
);
InputField.displayName = "InputField";

// ─── SectionHeader ────────────────────────────────────────────────────────────

export const SectionHeader = ({ title }: { title: string }) => {
  const colors = useColors();
  return (
    <XStack
      paddingHorizontal={Spacing.lg}
      paddingVertical={Spacing.xs}
      paddingBottom={8}
      borderBottomWidth={1}
      borderBottomColor={colors.surfaceSecondary}
    >
      <Text
        color={colors.textTertiary}
        fontSize={12}
        fontWeight="600"
        letterSpacing={1.2}
      >
        {title.toUpperCase()}
      </Text>
    </XStack>
  );
};

// ─── Separator ────────────────────────────────────────────────────────────────

export const Separator = () => {
  const colors = useColors();
  return <View height={1} backgroundColor={colors.separator} />;
};
