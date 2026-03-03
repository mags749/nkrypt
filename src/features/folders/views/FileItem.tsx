import React from "react";
import { Text, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";

interface FileItemProps {
  file: NkryptFile;
  onPress: () => void;
  onDelete: () => void;
}

export const FileItem = ({ file, onPress, onDelete }: FileItemProps) => {
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
          {file.site}
        </Text>
        <Text fontSize={13} color={colors.textTertiary}>
          ••••••
        </Text>
      </YStack>
      <XStack
        onPress={onDelete}
        width={32}
        height={32}
        borderRadius={16}
        backgroundColor={colors.surfaceSecondary}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ opacity: 0.7 }}
        hitSlop={8}
      >
        <BxIcon name="bx-trash" size={16} color={colors.textTertiary} />
      </XStack>
    </XStack>
  );
};
