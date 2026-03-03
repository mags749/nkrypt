import React from "react";
import { Text, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing } from "@shared/constants/design";

export const FoldersEmptyState = () => {
  const colors = useColors();
  return (
    <YStack alignItems="center" paddingTop={80} gap={Spacing.md}>
      <BxIcon name="bx-folder" size={42} color={colors.textTertiary} />
      <Text
        color={colors.textTertiary}
        fontSize={15}
        textAlign="center"
        lineHeight={24}
      >
        {"No folders yet.\nTap + to create one."}
      </Text>
    </YStack>
  );
};
