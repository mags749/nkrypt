import React from "react";
import { View, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

interface PinDotsProps {
  value: string;
  maxLength: number;
}

export const PinDots = ({ value, maxLength }: PinDotsProps) => {
  const colors = useColors();
  const dots = Array.from({ length: maxLength }, (_, i) => i < value.length);
  return (
    <XStack gap={Spacing.lg}>
      {dots.map((filled, i) => (
        <View
          key={i}
          width={14}
          height={14}
          borderRadius={7}
          borderWidth={1.5}
          backgroundColor={filled ? colors.textPrimary : "transparent"}
          borderColor={filled ? colors.textPrimary : colors.border}
        />
      ))}
    </XStack>
  );
};
