import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { WarningBox } from "@shared/components/WarningBox";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { NkryptIcon } from "@shared/components/ui/NkryptLogo";
import { Spacing, Typography } from "@shared/constants/design";

interface SetupViewProps {
  step: 1 | 2 | 3 | 4;
  // Step 1: passphrase text
  passPhrase: string;
  onPassPhraseChange: (v: string) => void;
  showPassPhrase: boolean;
  onToggleShowPassPhrase: () => void;
  // Step 2: confirm passphrase
  passPhraseConfirm: string;
  onPassPhraseConfirmChange: (v: string) => void;
  // Step 3: passkey numeric
  passKey: string;
  onPassKeyChange: (v: string) => void;
  // Step 4: confirm passkey
  passKeyConfirm: string;
  onPassKeyConfirmChange: (v: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
  progressAnim: Animated.Value;
  onStep1: () => void;
  onStep2: () => void;
  onStep3: () => void;
  onSetup: () => void;
}

export const SetupView = ({
  step,
  passPhrase,
  onPassPhraseChange,
  showPassPhrase,
  onToggleShowPassPhrase,
  passPhraseConfirm,
  onPassPhraseConfirmChange,
  passKey,
  onPassKeyChange,
  passKeyConfirm,
  onPassKeyConfirmChange,
  errors,
  isLoading,
  progressAnim,
  onStep1,
  onStep2,
  onStep3,
  onSetup,
}: SetupViewProps) => {
  const colors = useColors();
  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["25%", "100%"],
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message="Setting up your vault…" />
      <View
        style={[styles.track, { backgroundColor: colors.surfaceSecondary }]}
      >
        <Animated.View
          style={[
            styles.bar,
            { backgroundColor: colors.accent, width: barWidth },
          ]}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.iconCircle, { borderColor: colors.border }]}>
            <NkryptIcon size={36} color={colors.textPrimary} />
          </View>
          <Text style={[styles.badge, { color: colors.textTertiary }]}>
            STEP {step} OF 4
          </Text>

          {/* ─── Step 1: Create Pass Phrase ──────────────────────────────── */}
          {step === 1 && (
            <>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Create Pass Phrase
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                A text passphrase used for login. Can include letters, numbers,
                and symbols.
              </Text>
              <View style={styles.passFieldWrapper}>
                <InputField
                  label="Pass Phrase"
                  value={passPhrase}
                  onChangeText={onPassPhraseChange}
                  secureTextEntry={!showPassPhrase}
                  placeholder="Min. 4 characters"
                  autoFocus
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
            </>
          )}

          {/* ─── Step 2: Confirm Pass Phrase ─────────────────────────────── */}
          {step === 2 && (
            <>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Confirm Pass Phrase
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Re-enter your Pass Phrase to confirm.
              </Text>
              <View style={styles.passFieldWrapper}>
                <InputField
                  label="Confirm Pass Phrase"
                  value={passPhraseConfirm}
                  onChangeText={onPassPhraseConfirmChange}
                  secureTextEntry={!showPassPhrase}
                  placeholder="Repeat your passphrase"
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.passPhraseConfirm}
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
            </>
          )}

          {/* ─── Step 3: Create Pass Key (numeric) ───────────────────────── */}
          {step === 3 && (
            <>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Create Pass Key
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                A numeric PIN (4–6 digits, max 999999) used for AES-256
                encryption. Different from your Pass Phrase.
              </Text>
              <WarningBox text="If you lose your Pass Key, your encrypted data cannot be recovered." />
              <View style={styles.pinPadWrapper}>
                <PassKeyInput
                  value={passKey}
                  onChange={onPassKeyChange}
                  autoFocus
                />
                {errors.passKey ? (
                  <Text style={[styles.err, { color: colors.error }]}>
                    {errors.passKey}
                  </Text>
                ) : null}
              </View>
            </>
          )}

          {/* ─── Step 4: Confirm Pass Key ────────────────────────────────── */}
          {step === 4 && (
            <>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Confirm Pass Key
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Re-enter your numeric Pass Key to confirm.
              </Text>
              <View style={styles.pinPadWrapper}>
                <PassKeyInput
                  value={passKeyConfirm}
                  onChange={onPassKeyConfirmChange}
                  autoFocus
                />
                {errors.passKeyConfirm ? (
                  <Text style={[styles.err, { color: colors.error }]}>
                    {errors.passKeyConfirm}
                  </Text>
                ) : null}
              </View>
              {errors.general && (
                <Text
                  style={[
                    styles.err,
                    { color: colors.error, textAlign: "center" },
                  ]}
                >
                  {errors.general}
                </Text>
              )}
            </>
          )}
        </ScrollView>
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          {step === 1 && <Button label="Next" onPress={onStep1} fullWidth />}
          {step === 2 && (
            <Button label="Confirm Phrase" onPress={onStep2} fullWidth />
          )}
          {step === 3 && (
            <Button label="Next" onPress={onStep3} fullWidth />
          )}
          {step === 4 && (
            <Button
              label="Create Vault"
              loading={isLoading}
              loadingLabel="Setting up…"
              onPress={onSetup}
              fullWidth
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  track: { height: 3, width: "100%" },
  bar: { height: 3 },
  scroll: {
    padding: Spacing["2xl"],
    paddingTop: Spacing["3xl"],
    gap: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  badge: { ...Typography.labelMD, letterSpacing: 1.5 },
  title: { fontSize: 28, fontWeight: "600", letterSpacing: -0.5 },
  subtitle: { ...Typography.bodyMD, lineHeight: 22 },
  passFieldWrapper: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 0,
    bottom: Spacing.xl,
    padding: Spacing.sm,
  },
  pinPadWrapper: { alignItems: "center", gap: Spacing.md },
  err: { ...Typography.caption },
  footer: { padding: Spacing["2xl"], paddingTop: Spacing.md },
});
