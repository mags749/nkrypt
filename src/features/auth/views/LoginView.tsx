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
import { type BiometricInfo } from "@features/auth/store/authStore";
import { BxIcon } from "@shared/components/BxIcon";
import { ErrorBanner } from "@shared/components/ErrorBanner";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { NkryptIcon } from "@shared/components/ui/NkryptLogo";
import { Radius, Spacing, Typography } from "@shared/constants/design";

interface LoginViewProps {
  passPhrase: string;
  onPassPhraseChange: (v: string) => void;
  showPassPhrase: boolean;
  onTogglePassPhrase: () => void;
  passKey: string;
  onPassKeyChange: (v: string) => void;
  isLoading: boolean;
  loadingMsg: string;
  error: string | null;
  bioVerified: boolean;
  bioInfo: BiometricInfo;
  isBiometricEnabled: boolean;
  shakeAnim: Animated.Value;
  onLogin: () => void;
  onBiometric: () => void;
}

export const LoginView = ({
  passPhrase,
  onPassPhraseChange,
  showPassPhrase,
  onTogglePassPhrase,
  passKey,
  onPassKeyChange,
  isLoading,
  loadingMsg,
  error,
  bioVerified,
  bioInfo,
  isBiometricEnabled,
  shakeAnim,
  onLogin,
  onBiometric,
}: LoginViewProps) => {
  const colors = useColors();
  const isFace = bioInfo.types.includes("facial");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message={loadingMsg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconCircle,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <NkryptIcon size={40} color={colors.textPrimary} />
            </View>
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Enter Credentials
          </Text>

          {error && <ErrorBanner message={error} shakeAnim={shakeAnim} />}

          {bioVerified ? (
            <View
              style={[
                styles.bioConfirmed,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <BxIcon
                name="bxs-check-circle"
                size={18}
                color={colors.success}
              />
              <Text
                style={[
                  styles.bioConfirmedText,
                  { color: colors.textSecondary },
                ]}
              >
                Identity verified — enter your Pass Key
              </Text>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.passSection,
                { transform: [{ translateX: shakeAnim }] },
              ]}
            >
              <View style={styles.passFieldWrapper}>
                <InputField
                  label="Pass Phrase"
                  value={passPhrase}
                  onChangeText={onPassPhraseChange}
                  secureTextEntry={!showPassPhrase}
                  placeholder="Your passphrase"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
                <TouchableOpacity
                  onPress={onTogglePassPhrase}
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
            </Animated.View>
          )}

          <View style={styles.passKeySection}>
            <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>
              PASS KEY
            </Text>
            <PassKeyInput
              value={passKey}
              onChange={onPassKeyChange}
              autoFocus={bioVerified}
              showBiometric={
                isBiometricEnabled &&
                !bioVerified &&
                bioInfo.available &&
                bioInfo.enrolled
              }
              biometricType={isFace ? "facial" : "fingerprint"}
              onBiometric={onBiometric}
            />
          </View>
        </ScrollView>
        <Text style={[styles.copyright, { color: colors.textTertiary }]}>
          © 2025 NKRYPT SECURE SYSTEMS
        </Text>
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button
            label="Login"
            loading={isLoading}
            loadingLabel="Verifying…"
            onPress={onLogin}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    padding: Spacing["2xl"],
    paddingTop: Spacing["4xl"],
    gap: Spacing["2xl"],
  },
  iconContainer: { alignItems: "center" },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 32, fontWeight: "600", letterSpacing: -0.8 },
  passSection: { gap: Spacing.lg },
  passFieldWrapper: { position: "relative" },
  fieldLabel: {
    ...Typography.labelMD,
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },
  passKeySection: { gap: Spacing.md, alignItems: "center" },
  eyeBtn: {
    position: "absolute",
    right: 0,
    bottom: Spacing.xl,
    padding: Spacing.sm,
  },
  bioConfirmed: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  bioConfirmedText: { ...Typography.bodyMD, flex: 1 },
  copyright: {
    ...Typography.labelSM,
    textAlign: "center",
    paddingBottom: Spacing.sm,
    letterSpacing: 1.5,
  },
  footer: { padding: Spacing["2xl"], paddingTop: Spacing.sm },
});
