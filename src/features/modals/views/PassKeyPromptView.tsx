import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BlurModal } from "@shared/components/BlurModal";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { Button } from "@shared/components/ui";
import { Spacing, Typography } from "@shared/constants/design";

interface PassKeyPromptViewProps {
  mode?: "copy" | "reveal";
  passKey: string;
  onPassKeyChange: (v: string) => void;
  error: string | null;
  isLoading: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const PassKeyPromptView = ({
  mode,
  passKey,
  onPassKeyChange,
  error,
  isLoading,
  onConfirm,
  onDismiss,
}: PassKeyPromptViewProps) => {
  const colors = useColors();
  const modeLabel = mode === "copy" ? "Copy" : "Reveal";
  return (
    <BlurModal visible onDismiss={onDismiss} position="flex-end">
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Verify Pass Key
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {mode === "copy"
            ? "Enter your Pass Key to copy the credentials."
            : "Enter your Pass Key to reveal the credentials."}
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <PassKeyInput
          value={passKey}
          onChange={onPassKeyChange}
          autoFocus
        />
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onDismiss} activeOpacity={0.7}>
          <Text style={[styles.cancel, { color: colors.textSecondary }]}>
            CANCEL
          </Text>
        </TouchableOpacity>
        <Button
          label={modeLabel}
          onPress={onConfirm}
          loading={isLoading}
          loadingLabel="Decrypting…"
          size="md"
        />
      </View>
    </BlurModal>
  );
};

const styles = StyleSheet.create({
  titleBlock: { gap: Spacing.xs, marginBottom: Spacing["2xl"] },
  title: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  subtitle: { ...Typography.bodyMD },
  inputWrapper: {
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  errorText: { ...Typography.caption, textAlign: "center" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  cancel: { ...Typography.labelLG, letterSpacing: 1.5 },
});
