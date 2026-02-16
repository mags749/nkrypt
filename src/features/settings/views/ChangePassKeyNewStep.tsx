import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { WarningBox } from "@shared/components/WarningBox";
import { Spacing, Typography } from "@shared/constants/design";

interface ChangePassKeyNewStepProps {
  newKey: string;
  newKeyConfirm: string;
  errors: Record<string, string>;
  onNewKeyChange: (v: string) => void;
  onNewKeyConfirmChange: (v: string) => void;
}

export const ChangePassKeyNewStep = ({
  newKey,
  newKeyConfirm,
  errors,
  onNewKeyChange,
  onNewKeyConfirmChange,
}: ChangePassKeyNewStepProps) => {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        New Pass Key
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Choose a new 4–6 digit Pass Key. All files will be re-encrypted.
      </Text>
      <WarningBox
        text="All stored credentials will be re-encrypted with the new Pass Key. This cannot be undone."
        variant="error"
      />

      <View style={styles.keyBlock}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>
          NEW PASS KEY
        </Text>
        <PassKeyInput value={newKey} onChange={onNewKeyChange} autoFocus />
        {errors.newKey ? (
          <Text style={[styles.error, { color: colors.error }]}>
            {errors.newKey}
          </Text>
        ) : null}
      </View>

      <View style={styles.keyBlock}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>
          CONFIRM PASS KEY
        </Text>
        <PassKeyInput value={newKeyConfirm} onChange={onNewKeyConfirmChange} />
        {errors.newKeyConfirm ? (
          <Text style={[styles.error, { color: colors.error }]}>
            {errors.newKeyConfirm}
          </Text>
        ) : null}
      </View>

      {errors.general && (
        <Text
          style={[styles.error, { color: colors.error, textAlign: "center" }]}
        >
          {errors.general}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing["2xl"] },
  title: { fontSize: 26, fontWeight: "600", letterSpacing: -0.5 },
  subtitle: { ...Typography.bodyMD, lineHeight: 22 },
  label: { ...Typography.labelMD, letterSpacing: 1.2 },
  keyBlock: { gap: Spacing.md, alignItems: "center" },
  error: { ...Typography.caption },
});
