import React from "react";
import { View } from "tamagui";
import { useColors } from "@context/providers/themeStore";
import { Spacing } from "@shared/constants/design";

export const RowDivider = () => {
  const colors = useColors();
  return (
    <View
      height={1}
      marginLeft={Spacing.lg + 34 + Spacing.md}
      backgroundColor={colors.border}
    />
  );
};
