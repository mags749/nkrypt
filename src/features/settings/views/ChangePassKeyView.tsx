import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

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
  verifyAttempts: number;
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
  verifyAttempts,
  onBack,
  onVerify,
  onSave,
}: ChangePassKeyViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message="Verifying credentials…" />
      <ScreenHeader title="Change Pass Key" onBack={onBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: Spacing["2xl"],
            paddingTop: Spacing.lg,
            gap: Spacing["2xl"],
          }}
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

          {/* General error / attempt warning shown at bottom of scroll area */}
          {errors.general && (
            <Text
              color={verifyAttempts >= 3 ? colors.error : colors.error}
              fontSize={13}
              fontWeight="600"
              textAlign="center"
              paddingHorizontal={Spacing.lg}
            >
              {errors.general}
            </Text>
          )}
          {step === "verify" && verifyAttempts > 0 && verifyAttempts < 3 && !errors.general && (
            <Text color={colors.error} fontSize={12} textAlign="center">
              {3 - verifyAttempts} attempt{3 - verifyAttempts === 1 ? "" : "s"} remaining before app exit
            </Text>
          )}
        </ScrollView>
        <YStack
          padding={Spacing["2xl"]}
          paddingTop={Spacing.md}
          backgroundColor={colors.background}
        >
          {step === "verify" ? (
            <Button
              label="Continue"
              onPress={onVerify}
              loading={isLoading}
              loadingLabel="Verifying…"
              fullWidth
              disabled={verifyAttempts >= 3}
            />
          ) : (
            <Button
              label="Save New Pass Key"
              loading={isLoading}
              loadingLabel="Re-encrypting…"
              onPress={onSave}
              fullWidth
            />
          )}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
