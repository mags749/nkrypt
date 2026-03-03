import React from "react";
import { Text, View, YStack } from "tamagui";
import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing } from "@shared/constants/design";

interface SectionGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const SectionGroup = ({ title, children }: SectionGroupProps) => {
  const colors = useColors();
  return (
    <YStack gap={Spacing.sm}>
      {title && (
        <Text
          color={colors.textTertiary}
          fontSize={10}
          fontWeight="500"
          letterSpacing={1.0}
          paddingHorizontal={Spacing.xs}
        >
          {title.toUpperCase()}
        </Text>
      )}
      <View
        borderRadius={Radius.lg}
        borderWidth={1}
        borderColor={colors.border}
        backgroundColor={colors.surface}
        overflow="hidden"
      >
        {children}
      </View>
    </YStack>
  );
};
