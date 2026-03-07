import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { ScreenHeader } from "@shared/components/ScreenHeader";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Spacing } from "@shared/constants/design";

type Step = "verify" | "new" | "confirm";

interface ChangePassPhraseViewProps {
  step: Step;
  currentPhrase: string;
  onPhraseChange: (v: string) => void;
  showPhrase: boolean;
  onToggleShow: () => void;
  isLoading: boolean;
  error: string | null;
  verifyAttempts: number;
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
  verifyAttempts,
  primaryLabel,
  onPrimary,
  onBack,
}: ChangePassPhraseViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <LoadingOverlay visible={isLoading} message="Verifying…" />
      <ScreenHeader title={STEP_TITLES[step]} onBack={onBack} />

      <XStack
        gap={Spacing.sm}
        justifyContent="center"
        paddingVertical={Spacing.sm}
      >
        {STEPS.map((s) => (
          <View
            key={s}
            width={8}
            height={8}
            borderRadius={4}
            backgroundColor={s === step ? colors.accent : colors.border}
          />
        ))}
      </XStack>

      <YStack flex={1} padding={Spacing["2xl"]} gap={Spacing["2xl"]}>
        <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
          {STEP_SUBTITLES[step]}
        </Text>
        <View style={{ position: "relative" }}>
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
          <XStack
            onPress={onToggleShow}
            style={{
              position: "absolute",
              right: 0,
              bottom: Spacing.xl,
              padding: Spacing.sm,
            }}
            pressStyle={{ opacity: 0.7 }}
          >
            <BxIcon
              name={showPhrase ? "bx-hide" : "bx-show"}
              size={18}
              color={colors.textTertiary}
            />
          </XStack>
        </View>

        {/* Show attempt counter warning on the verify step */}
        {step === "verify" && verifyAttempts > 0 && verifyAttempts < 3 && (
          <Text
            color={colors.error}
            fontSize={12}
            textAlign="center"
            fontWeight="600"
          >
            ⚠️ {3 - verifyAttempts} attempt{3 - verifyAttempts === 1 ? "" : "s"}{" "}
            remaining before app exits
          </Text>
        )}
      </YStack>

      <YStack
        padding={Spacing["2xl"]}
        paddingTop={Spacing.md}
        backgroundColor={colors.background}
      >
        <Button
          label={primaryLabel}
          onPress={onPrimary}
          loading={isLoading}
          loadingLabel={step === "verify" ? "Verifying…" : undefined}
          fullWidth
          disabled={step === "verify" && verifyAttempts >= 3}
        />
      </YStack>
    </SafeAreaView>
  );
};
