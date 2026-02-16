import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
  type ViewStyle,
} from "react-native";

import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing, Typography } from "@shared/constants/design";

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
}

export const Button = ({
  label,
  variant = "primary",
  size = "lg",
  loading = false,
  loadingLabel,
  fullWidth = false,
  style,
  disabled,
  ...rest
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
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled ?? loading}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          height,
          borderRadius: Radius.lg,
          opacity: disabled && !loading ? 0.45 : 1,
          width: fullWidth ? "100%" : undefined,
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: variant === "ghost" ? colors.border : undefined,
        },
        style as ViewStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={textColor} size="small" />
          {loadingLabel && (
            <Text style={[styles.buttonText, { color: textColor }]}>
              {loadingLabel.toUpperCase()}
            </Text>
          )}
        </View>
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>
          {label.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─── InputField ───────────────────────────────────────────────────────────────

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const InputField = forwardRef<TextInput, InputFieldProps>(
  ({ label, error, hint, style, ...props }, ref) => {
    const colors = useColors();

    return (
      <View style={styles.inputWrapper}>
        {label && (
          <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>
            {label.toUpperCase()}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
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
          <Text style={[styles.fieldNote, { color: colors.error }]}>
            {error}
          </Text>
        ) : hint ? (
          <Text style={[styles.fieldNote, { color: colors.textTertiary }]}>
            {hint}
          </Text>
        ) : null}
      </View>
    );
  },
);
InputField.displayName = "InputField";

// ─── SectionHeader ────────────────────────────────────────────────────────────

export const SectionHeader = ({ title }: { title: string }) => {
  const colors = useColors();
  return (
    <View
      style={[
        styles.sectionHeader,
        {
          borderBottomColor: colors.surfaceSecondary,
          borderBottomWidth: 1,
          paddingBottom: 8,
        },
      ]}
    >
      <Text style={[styles.sectionHeaderText, { color: colors.textTertiary }]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
};

// ─── Separator ────────────────────────────────────────────────────────────────

export const Separator = () => {
  const colors = useColors();
  return (
    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    ...Typography.labelLG,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  inputWrapper: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    ...Typography.labelMD,
    marginBottom: Spacing.sm,
  },
  input: {
    ...Typography.bodyLG,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
  },
  fieldNote: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  sectionHeaderText: {
    ...Typography.labelLG,
  },
  separator: {
    height: 1,
    marginHorizontal: Spacing.lg,
  },
});
