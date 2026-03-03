import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View as RNView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { WarningBox } from "@shared/components/WarningBox";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { NkryptIcon } from "@shared/components/ui/NkryptLogo";
import { Spacing } from "@shared/constants/design";

interface SetupViewProps {
  step: 1 | 2 | 3 | 4;
  passPhrase: string;
  onPassPhraseChange: (v: string) => void;
  showPassPhrase: boolean;
  onToggleShowPassPhrase: () => void;
  passPhraseConfirm: string;
  onPassPhraseConfirmChange: (v: string) => void;
  passKey: string;
  onPassKeyChange: (v: string) => void;
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
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message="Setting up your vault…" />

      {/* Progress bar */}
      <View height={3} width="100%" backgroundColor={colors.surfaceSecondary}>
        <Animated.View
          style={{ height: 3, backgroundColor: colors.accent, width: barWidth }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: Spacing["2xl"],
            paddingTop: Spacing["3xl"],
            gap: Spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <XStack
            width={64}
            height={64}
            borderRadius={32}
            borderWidth={1}
            borderColor={colors.border}
            alignItems="center"
            justifyContent="center"
            alignSelf="flex-start"
          >
            <NkryptIcon size={36} color={colors.textPrimary} />
          </XStack>

          <Text
            color={colors.textTertiary}
            fontSize={11}
            fontWeight="600"
            letterSpacing={1.5}
          >
            STEP {step} OF 4
          </Text>

          {step === 1 && (
            <>
              <Text
                fontSize={28}
                fontWeight="600"
                letterSpacing={-0.5}
                color={colors.textPrimary}
              >
                Create Pass Phrase
              </Text>
              <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
                A text passphrase used for login. Can include letters, numbers,
                and symbols.
              </Text>
              <View style={{ position: "relative" }}>
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
                <XStack
                  onPress={onToggleShowPassPhrase}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: Spacing.xl,
                    padding: Spacing.sm,
                  }}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <BxIcon
                    name={showPassPhrase ? "bx-hide" : "bx-show"}
                    size={18}
                    color={colors.textTertiary}
                  />
                </XStack>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text
                fontSize={28}
                fontWeight="600"
                letterSpacing={-0.5}
                color={colors.textPrimary}
              >
                Confirm Pass Phrase
              </Text>
              <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
                Re-enter your Pass Phrase to confirm.
              </Text>
              <View style={{ position: "relative" }}>
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
                <XStack
                  onPress={onToggleShowPassPhrase}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: Spacing.xl,
                    padding: Spacing.sm,
                  }}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <BxIcon
                    name={showPassPhrase ? "bx-hide" : "bx-show"}
                    size={18}
                    color={colors.textTertiary}
                  />
                </XStack>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text
                fontSize={28}
                fontWeight="600"
                letterSpacing={-0.5}
                color={colors.textPrimary}
              >
                Create Pass Key
              </Text>
              <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
                A numeric PIN (4–6 digits, max 999999) used for AES-256
                encryption.
              </Text>
              <WarningBox text="If you lose your Pass Key, your encrypted data cannot be recovered." />
              <YStack alignItems="center" gap={Spacing.md}>
                <PassKeyInput
                  value={passKey}
                  onChange={onPassKeyChange}
                  autoFocus
                />
                {errors.passKey && (
                  <Text color={colors.error} fontSize={12}>
                    {errors.passKey}
                  </Text>
                )}
              </YStack>
            </>
          )}

          {step === 4 && (
            <>
              <Text
                fontSize={28}
                fontWeight="600"
                letterSpacing={-0.5}
                color={colors.textPrimary}
              >
                Confirm Pass Key
              </Text>
              <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
                Re-enter your numeric Pass Key to confirm.
              </Text>
              <YStack alignItems="center" gap={Spacing.md}>
                <PassKeyInput
                  value={passKeyConfirm}
                  onChange={onPassKeyConfirmChange}
                  autoFocus
                />
                {errors.passKeyConfirm && (
                  <Text color={colors.error} fontSize={12}>
                    {errors.passKeyConfirm}
                  </Text>
                )}
              </YStack>
              {errors.general && (
                <Text color={colors.error} fontSize={12} textAlign="center">
                  {errors.general}
                </Text>
              )}
            </>
          )}
        </ScrollView>

        <YStack
          padding={Spacing["2xl"]}
          paddingTop={Spacing.md}
          backgroundColor={colors.background}
        >
          {step === 1 && <Button label="Next" onPress={onStep1} fullWidth />}
          {step === 2 && (
            <Button label="Confirm Phrase" onPress={onStep2} fullWidth />
          )}
          {step === 3 && <Button label="Next" onPress={onStep3} fullWidth />}
          {step === 4 && (
            <Button
              label="Create Vault"
              loading={isLoading}
              loadingLabel="Setting up…"
              onPress={onSetup}
              fullWidth
            />
          )}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
