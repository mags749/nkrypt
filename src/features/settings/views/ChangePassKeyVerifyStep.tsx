import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { InputField } from "@shared/components/ui";
import { Spacing, Typography } from "@shared/constants/design";

interface ChangePassKeyVerifyStepProps {
  passPhrase: string;
  currentKey: string;
  showPassPhrase: boolean;
  errors: Record<string, string>;
  onPassPhraseChange: (v: string) => void;
  onKeyChange: (v: string) => void;
  onToggleShowPassPhrase: () => void;
}

export const ChangePassKeyVerifyStep = ({
  passPhrase,
  currentKey,
  showPassPhrase,
  errors,
  onPassPhraseChange,
  onKeyChange,
  onToggleShowPassPhrase,
}: ChangePassKeyVerifyStepProps) => {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Verify Identity
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your current Pass Phrase and Pass Key to continue.
      </Text>

      {/* Pass Phrase (text) */}
      <View style={styles.inputWrapper}>
        <InputField
          label="Current Pass Phrase"
          value={passPhrase}
          onChangeText={onPassPhraseChange}
          secureTextEntry={!showPassPhrase}
          placeholder="Your passphrase"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.passPhrase}
        />
        <TouchableOpacity
          onPress={onToggleShowPassPhrase}
          style={styles.eyeBtn}
          activeOpacity={0.7}
        >
          <BxIcon
            name={showPassPhrase ? "bx-hide" : "bx-show"}
            size={18}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Current Pass Key (numeric) */}
      <View style={styles.keyBlock}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>
          CURRENT PASS KEY
        </Text>
        <PassKeyInput value={currentKey} onChange={onKeyChange} />
        {errors.currentKey && (
          <Text style={[styles.error, { color: colors.error }]}>
            {errors.currentKey}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: Spacing["2xl"] },
  title: { fontSize: 26, fontWeight: "600", letterSpacing: -0.5 },
  subtitle: { ...Typography.bodyMD, lineHeight: 22 },
  inputWrapper: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 0,
    bottom: Spacing.xl,
    padding: Spacing.sm,
  },
  label: { ...Typography.labelMD, letterSpacing: 1.2 },
  keyBlock: { gap: Spacing.md, alignItems: "center" },
  error: { ...Typography.caption },
});
