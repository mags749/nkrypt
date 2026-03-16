import React from "react";
import { Text, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { ActionBtn } from "@shared/components/FileDetail/ActionBtn";
import { Radius, Spacing } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";

interface FileItemProps {
  file: NkryptFile;
  onPress: () => void;
  onReveal: () => void;
  onCopy: () => void;
  onOpenLink: () => void;
  onDelete: () => void;
  isRevealed: boolean;
  decryptedValue: string | null;
  /** Seconds remaining before the revealed value is automatically hidden (Change 2) */
  secondsLeft: number | null;
}

export const FileItem = ({
  file,
  onPress,
  onReveal,
  onCopy,
  onOpenLink,
  onDelete,
  isRevealed,
  decryptedValue,
  secondsLeft,
}: FileItemProps) => {
  const colors = useColors();

  const displayValue =
    isRevealed && decryptedValue !== null
      ? decryptedValue
      : file.isEncrypted
        ? "• • • • • • • • • • • •"
        : file.value;

  return (
    <XStack
      alignItems="center"
      paddingVertical={Spacing.lg}
      paddingHorizontal={Spacing.lg}
      gap={Spacing.md}
    >
      {/* Label + value — tappable area for encrypted edit */}
      <YStack flex={1} gap={6} onPress={onPress} pressStyle={{ opacity: 0.7 }}>
        <XStack alignItems="center" gap={Spacing.sm}>
          <Text
            color={colors.textTertiary}
            fontSize={10}
            fontWeight="500"
            letterSpacing={0.8}
          >
            {file.key.toUpperCase()}
          </Text>
        </XStack>

        <Text
          color={
            file.isEncrypted && !isRevealed
              ? colors.textTertiary
              : colors.textPrimary
          }
          fontSize={17}
          fontWeight="400"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayValue}
        </Text>
      </YStack>

      {/* Action buttons — match screenshot style */}
      <XStack gap={Spacing.sm} alignItems="center">
        {/* Change 2: countdown badge while value is revealed */}
        {isRevealed && secondsLeft !== null && (
          <XStack
            backgroundColor={colors.accent}
            marginTop={Spacing.xs}
            paddingHorizontal={6}
            paddingVertical={2}
            borderRadius={Radius.sm}
            alignItems="center"
            justifyContent="center"
            alignSelf="flex-start"
          >
            <Text
              color={colors.accentForeground}
              fontSize={9}
              fontWeight="700"
              letterSpacing={0.4}
            >
              {`hides in ${secondsLeft}s`}
            </Text>
          </XStack>
        )}
        {file.isLink && !file.isEncrypted && (
          <ActionBtn icon="bx-link-external" onPress={onOpenLink} />
        )}
        {file.isEncrypted && (
          <ActionBtn
            icon={isRevealed ? "bx-show" : "bx-hide"}
            onPress={onReveal}
          />
        )}
        <ActionBtn icon="bx-copy" onPress={onCopy} />
      </XStack>
    </XStack>
  );
};
