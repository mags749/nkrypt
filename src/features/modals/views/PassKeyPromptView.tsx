import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BlurModal } from "@shared/components/BlurModal";
import { PassKeyInput } from "@shared/components/PassKeyInput";
import { Button } from "@shared/components/ui";
import { Spacing } from "@shared/constants/design";

interface PassKeyPromptViewProps {
  mode?: "copy" | "reveal" | "copy-username";
  passKey: string;
  onPassKeyChange: (v: string) => void;
  error: string | null;
  isLoading: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const PassKeyPromptView = ({
  mode,
  passKey,
  onPassKeyChange,
  error,
  isLoading,
  onConfirm,
  onDismiss,
}: PassKeyPromptViewProps) => {
  const colors = useColors();
  const modeLabel =
    mode === "copy" || mode === "copy-username" ? "Copy" : "Reveal";
  const subtitle =
    mode === "copy"
      ? "Enter your Pass Key to copy the credentials."
      : mode === "copy-username"
        ? "Enter your Pass Key to copy the username."
        : "Enter your Pass Key to reveal the credentials.";

  return (
    <BlurModal visible onDismiss={onDismiss} position="flex-end">
      <YStack gap={Spacing.xs} marginBottom={Spacing["2xl"]}>
        <Text
          fontSize={22}
          fontWeight="700"
          letterSpacing={-0.3}
          color={colors.textPrimary}
        >
          Verify Pass Key
        </Text>
        <Text fontSize={15} color={colors.textSecondary}>
          {subtitle}
        </Text>
      </YStack>

      <YStack alignItems="center" marginBottom={Spacing.lg} gap={Spacing.sm}>
        <PassKeyInput value={passKey} onChange={onPassKeyChange} autoFocus />
        {error && (
          <Text color={colors.error} fontSize={12} textAlign="center">
            {error}
          </Text>
        )}
      </YStack>

      <XStack
        alignItems="center"
        justifyContent="flex-end"
        gap={Spacing.lg}
        marginTop={Spacing.sm}
      >
        <XStack onPress={onDismiss} pressStyle={{ opacity: 0.7 }}>
          <Text
            color={colors.textSecondary}
            fontSize={12}
            fontWeight="600"
            letterSpacing={1.5}
          >
            CANCEL
          </Text>
        </XStack>
        <Button
          label={modeLabel}
          onPress={onConfirm}
          loading={isLoading}
          loadingLabel="Decrypting…"
          size="md"
        />
      </XStack>
    </BlurModal>
  );
};
