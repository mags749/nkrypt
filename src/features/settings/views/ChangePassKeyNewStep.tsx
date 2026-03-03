import React from "react";
import { Text, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { WarningBox } from "@shared/components/WarningBox";
import { Spacing } from "@shared/constants/design";

interface ChangePassKeyNewStepProps {
  newKey: string;
  newKeyConfirm: string;
  errors: Record<string, string>;
  onNewKeyChange: (v: string) => void;
  onNewKeyConfirmChange: (v: string) => void;
}

export const ChangePassKeyNewStep = ({
  newKey,
  newKeyConfirm,
  errors,
  onNewKeyChange,
  onNewKeyConfirmChange,
}: ChangePassKeyNewStepProps) => {
  const colors = useColors();
  return (
    <YStack gap={Spacing["2xl"]}>
      <Text
        fontSize={26}
        fontWeight="600"
        letterSpacing={-0.5}
        color={colors.textPrimary}
      >
        New Pass Key
      </Text>
      <Text fontSize={15} color={colors.textSecondary} lineHeight={22}>
        Choose a new 4–6 digit Pass Key. All files will be re-encrypted.
      </Text>
      <WarningBox
        text="All stored credentials will be re-encrypted with the new Pass Key. This cannot be undone."
        variant="error"
      />

      <YStack gap={Spacing.md} alignItems="center">
        <Text
          color={colors.textTertiary}
          fontSize={11}
          fontWeight="600"
          letterSpacing={1.2}
        >
          NEW PASS KEY
        </Text>
        <PassKeyInput value={newKey} onChange={onNewKeyChange} autoFocus />
        {errors.newKey && (
          <Text color={colors.error} fontSize={12}>
            {errors.newKey}
          </Text>
        )}
      </YStack>

      <YStack gap={Spacing.md} alignItems="center">
        <Text
          color={colors.textTertiary}
          fontSize={11}
          fontWeight="600"
          letterSpacing={1.2}
        >
          CONFIRM PASS KEY
        </Text>
        <PassKeyInput value={newKeyConfirm} onChange={onNewKeyConfirmChange} />
        {errors.newKeyConfirm && (
          <Text color={colors.error} fontSize={12}>
            {errors.newKeyConfirm}
          </Text>
        )}
      </YStack>

      {errors.general && (
        <Text color={colors.error} fontSize={12} textAlign="center">
          {errors.general}
        </Text>
      )}
    </YStack>
  );
};
