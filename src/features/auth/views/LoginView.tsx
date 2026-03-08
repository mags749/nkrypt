import React from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { type BiometricInfo } from "@features/auth/store/authStore";
import { BxIcon } from "@shared/components/BxIcon";
import { ErrorBanner } from "@shared/components/ErrorBanner";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { NkryptIcon } from "@shared/components/ui/NkryptLogo";
import { Radius, Spacing } from "@shared/constants/design";

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
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message={loadingMsg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: Spacing["2xl"],
            paddingTop: Spacing["4xl"],
            gap: Spacing["2xl"],
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack alignItems="center">
            <XStack
              width={72}
              height={72}
              borderRadius={36}
              borderWidth={1}
              borderColor={colors.border}
              backgroundColor={colors.surface}
              alignItems="center"
              justifyContent="center"
            >
              <NkryptIcon size={64} />
            </XStack>
          </YStack>

          <Text
            fontSize={32}
            fontWeight="600"
            letterSpacing={-0.8}
            color={colors.textPrimary}
          >
            Enter Credentials
          </Text>

          {error && <ErrorBanner message={error} shakeAnim={shakeAnim} />}

          {bioVerified ? (
            <XStack
              alignItems="center"
              gap={Spacing.sm}
              padding={Spacing.lg}
              borderRadius={Radius.lg}
              borderWidth={1}
              borderColor={colors.border}
              backgroundColor={colors.surface}
            >
              <BxIcon
                name="bxs-check-circle"
                size={18}
                color={colors.success}
              />
              <Text fontSize={15} color={colors.textSecondary} flex={1}>
                Identity verified — enter your Pass Key
              </Text>
            </XStack>
          ) : (
            <Animated.View
              style={{
                transform: [{ translateX: shakeAnim }],
                gap: Spacing.lg,
              }}
            >
              <View style={{ position: "relative" }}>
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
                <XStack
                  onPress={onTogglePassPhrase}
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
            </Animated.View>
          )}

          <YStack gap={Spacing.md} alignItems="center">
            <Text
              color={colors.textTertiary}
              fontSize={11}
              fontWeight="600"
              letterSpacing={1.2}
            >
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
          </YStack>
        </ScrollView>

        <Text
          color={colors.textTertiary}
          fontSize={10}
          fontWeight="500"
          letterSpacing={1.5}
          textAlign="center"
          paddingBottom={Spacing.sm}
        >
          © 2025 NKRYPT SECURE SYSTEMS
        </Text>
        <YStack
          padding={Spacing["2xl"]}
          paddingTop={Spacing.sm}
          backgroundColor={colors.background}
        >
          <Button
            label="Login"
            loading={isLoading}
            loadingLabel="Verifying…"
            onPress={onLogin}
            fullWidth
          />
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
