import React from "react";
import { Text, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

export const SectionHeader = ({ title }: { title: string }) => {
  const colors = useColors();
  return (
    <XStack
      paddingHorizontal={Spacing.lg}
      paddingVertical={Spacing.xs}
      paddingBottom={8}
      borderBottomWidth={1}
      borderBottomColor={colors.surfaceSecondary}
    >
      <Text
        color={colors.textTertiary}
        fontSize={12}
        fontWeight="600"
        letterSpacing={1.2}
      >
        {title.toUpperCase()}
      </Text>
    </XStack>
  );
};
