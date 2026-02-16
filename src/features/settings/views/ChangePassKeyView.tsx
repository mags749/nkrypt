import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { ChangePassKeyNewStep } from "@features/settings/views/ChangePassKeyNewStep";
import { ChangePassKeyVerifyStep } from "@features/settings/views/ChangePassKeyVerifyStep";
import { ScreenHeader } from "@shared/components/ScreenHeader";
import { Button } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Spacing } from "@shared/constants/design";

interface ChangePassKeyViewProps {
  step: "verify" | "new";
  passPhrase: string;
  onPassPhraseChange: (v: string) => void;
  showPassPhrase: boolean;
  onToggleShowPassPhrase: () => void;
  currentKey: string;
  onCurrentKeyChange: (v: string) => void;
  newKey: string;
  onNewKeyChange: (v: string) => void;
  newKeyConfirm: string;
  onNewKeyConfirmChange: (v: string) => void;
  isLoading: boolean;
  errors: Record<string, string>;
  onBack: () => void;
  onVerify: () => void;
  onSave: () => void;
}

export const ChangePassKeyView = ({
  step,
  passPhrase,
  onPassPhraseChange,
  showPassPhrase,
  onToggleShowPassPhrase,
  currentKey,
  onCurrentKeyChange,
  newKey,
  onNewKeyChange,
  newKeyConfirm,
  onNewKeyConfirmChange,
  isLoading,
  errors,
  onBack,
  onVerify,
  onSave,
}: ChangePassKeyViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message="Re-encrypting all files…" />
      <ScreenHeader title="Change Pass Key" onBack={onBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === "verify" ? (
            <ChangePassKeyVerifyStep
              passPhrase={passPhrase}
              currentKey={currentKey}
              showPassPhrase={showPassPhrase}
              errors={errors}
              onPassPhraseChange={onPassPhraseChange}
              onKeyChange={onCurrentKeyChange}
              onToggleShowPassPhrase={onToggleShowPassPhrase}
            />
          ) : (
            <ChangePassKeyNewStep
              newKey={newKey}
              newKeyConfirm={newKeyConfirm}
              errors={errors}
              onNewKeyChange={onNewKeyChange}
              onNewKeyConfirmChange={onNewKeyConfirmChange}
            />
          )}
        </ScrollView>
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          {step === "verify" ? (
            <Button label="Continue" onPress={onVerify} fullWidth />
          ) : (
            <Button
              label="Save New Pass Key"
              loading={isLoading}
              loadingLabel="Re-encrypting…"
              onPress={onSave}
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
  scroll: {
    padding: Spacing["2xl"],
    paddingTop: Spacing.lg,
    gap: Spacing["2xl"],
  },
  footer: { padding: Spacing["2xl"], paddingTop: Spacing.md },
});
