import React from "react";
import { Text, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing } from "@shared/constants/design";
import type { FolderWithCount } from "@shared/types";

interface FolderCardProps {
  folder: FolderWithCount;
  onPress: () => void;
  onEdit: () => void;
}

export const FolderCard = ({ folder, onPress, onEdit }: FolderCardProps) => {
  const colors = useColors();
  return (
    <XStack
      onPress={onPress}
      alignItems="center"
      padding={Spacing.lg}
      pressStyle={{ opacity: 0.7 }}
    >
      <YStack flex={1} gap={4}>
        <Text
          fontSize={20}
          fontWeight="600"
          letterSpacing={-0.2}
          color={colors.textPrimary}
        >
          {folder.name}
        </Text>
        <Text fontSize={13} color={colors.textTertiary}>
          {folder.fileCount === 1 ? "1 file" : `${folder.fileCount} files`}
        </Text>
      </YStack>
      <XStack onPress={onEdit} pressStyle={{ opacity: 0.7 }} hitSlop={8}>
        <BxIcon name="pencil" size={16} color={colors.textTertiary} />
      </XStack>
    </XStack>
  );
};
