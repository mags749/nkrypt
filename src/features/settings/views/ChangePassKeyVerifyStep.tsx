import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { InputField } from "@shared/components/ui";
import { Spacing } from "@shared/constants/design";

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
    <YStack gap={Spacing["2xl"]}>
      <Text
        fontSize={26}
        fontWeight="600"
        letterSpacing={-0.5}
        color={colors.textPrimary}
      >
        Verify Identity
      </Text>
      <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
        Enter your current Pass Phrase and Pass Key to continue.
      </Text>

      <View style={{ position: "relative" }}>
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

      <YStack gap={Spacing.md} alignItems="center">
        <Text
          color={colors.textTertiary}
          fontSize={11}
          fontWeight="600"
          letterSpacing={1.2}
        >
          CURRENT PASS KEY
        </Text>
        <PassKeyInput value={currentKey} onChange={onKeyChange} />
        {errors.currentKey && (
          <Text color={colors.error} fontSize={12}>
            {errors.currentKey}
          </Text>
        )}
      </YStack>
    </YStack>
  );
};
