import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { ActionBtn } from "./ActionBtn";
import { Spacing } from "@shared/constants/design";

interface FieldRowProps {
  label: string;
  value: string;
  masked?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
}

export const FieldRow = ({
  label,
  value,
  masked = false,
  revealed = false,
  onReveal,
  onCopy,
  onEdit,
  onOpen,
}: FieldRowProps) => {
  const colors = useColors();
  const displayValue = masked && !revealed ? "• • • • • • • • • • • •" : value;

  return (
    <XStack paddingVertical={Spacing.lg} alignItems="center" gap={Spacing.md}>
      <YStack flex={1} gap={6}>
        <Text
          color={colors.textTertiary}
          fontSize={10}
          fontWeight="500"
          letterSpacing={0.8}
        >
          {label.toUpperCase()}
        </Text>
        <Text
          color={masked && !revealed ? colors.textTertiary : colors.textPrimary}
          fontSize={17}
          fontWeight="400"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayValue}
        </Text>
      </YStack>
      <XStack gap={Spacing.sm}>
        {onEdit && <ActionBtn icon="bx-edit" onPress={onEdit} />}
        {onOpen && <ActionBtn icon="bx-link-external" onPress={onOpen} />}
        {onReveal && (
          <ActionBtn
            icon={!revealed ? "bx-hide" : "bx-show"}
            onPress={onReveal}
          />
        )}
        {onCopy && <ActionBtn icon="bx-copy" onPress={onCopy} />}
      </XStack>
    </XStack>
  );
};
