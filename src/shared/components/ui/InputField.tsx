import React, { forwardRef } from "react";
import { TextInput as RNTextInput, type TextInputProps } from "react-native";
import { Text, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

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
