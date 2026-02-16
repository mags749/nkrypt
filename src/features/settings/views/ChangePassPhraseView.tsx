import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { ScreenHeader } from "@shared/components/ScreenHeader";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Spacing, Typography } from "@shared/constants/design";

type Step = "verify" | "new" | "confirm";

interface ChangePassPhraseViewProps {
  step: Step;
  currentPhrase: string;
  onPhraseChange: (v: string) => void;
  showPhrase: boolean;
  onToggleShow: () => void;
  isLoading: boolean;
  error: string | null;
  primaryLabel: string;
  onPrimary: () => void;
  onBack: () => void;
}

const STEP_TITLES: Record<Step, string> = {
  verify: "Verify Current Pass Phrase",
  new: "New Pass Phrase",
  confirm: "Confirm New Pass Phrase",
};

const STEP_SUBTITLES: Record<Step, string> = {
  verify: "Enter your current Pass Phrase to continue.",
  new: "Choose a new Pass Phrase. Min. 4 characters.",
  confirm: "Re-enter your new Pass Phrase to confirm.",
};

const STEPS: Step[] = ["verify", "new", "confirm"];

export const ChangePassPhraseView = ({
  step,
  currentPhrase,
  onPhraseChange,
  showPhrase,
  onToggleShow,
  isLoading,
  error,
  primaryLabel,
  onPrimary,
  onBack,
}: ChangePassPhraseViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message="Updating Pass Phrase…" />
      <ScreenHeader title={STEP_TITLES[step]} onBack={onBack} />
      <View style={styles.dots}>
        {STEPS.map((s) => (
          <View
            key={s}
            style={[
              styles.dot,
              { backgroundColor: s === step ? colors.accent : colors.border },
            ]}
          />
        ))}
      </View>
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {STEP_SUBTITLES[step]}
        </Text>
        <View style={styles.inputWrapper}>
          <InputField
            label={
              step === "verify"
                ? "Current Pass Phrase"
                : step === "new"
                  ? "New Pass Phrase"
                  : "Confirm Pass Phrase"
            }
            value={currentPhrase}
            onChangeText={onPhraseChange}
            secureTextEntry={!showPhrase}
            placeholder="Your passphrase"
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            error={error ?? undefined}
          />
          <TouchableOpacity
            onPress={onToggleShow}
            style={styles.eyeBtn}
            activeOpacity={0.7}
          >
            <BxIcon
              name={showPhrase ? "bx-hide" : "bx-show"}
              size={18}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          label={primaryLabel}
          onPress={onPrimary}
          loading={isLoading}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  dots: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
    paddingVertical: Spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  content: {
    flex: 1,
    padding: Spacing["2xl"],
    gap: Spacing["2xl"],
  },
  subtitle: { ...Typography.bodyMD, lineHeight: 22 },
  inputWrapper: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 0,
    bottom: Spacing.xl,
    padding: Spacing.sm,
  },
  footer: { padding: Spacing["2xl"], paddingTop: Spacing.md },
});
