import React from "react";
import { View, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

interface PassKeyDotsProps {
  value: string;
  maxLength: number;
}

export const PassKeyDots = ({ value, maxLength }: PassKeyDotsProps) => {
  const colors = useColors();
  const visibleCount = Math.min(value.length + 1, maxLength);

  return (
    <XStack gap={Spacing.lg} alignItems="center" height={16}>
      {Array.from({ length: visibleCount }, (_, i) => {
        const isFilled = i < value.length;
        return (
          <View
            key={i}
            width={isFilled ? 16 : 12}
            height={isFilled ? 16 : 12}
            borderRadius={isFilled ? 8 : 6}
            borderWidth={2}
            backgroundColor={isFilled ? colors.textPrimary : "transparent"}
            borderColor={isFilled ? colors.textPrimary : colors.border}
          />
        );
      })}
    </XStack>
  );
};
