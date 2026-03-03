import React from "react";
import { Text, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing } from "@shared/constants/design";

interface WarningBoxProps {
  text: string;
  variant?: "warning" | "error";
}

export const WarningBox = ({ text, variant = "warning" }: WarningBoxProps) => {
  const colors = useColors();
  const accent = variant === "error" ? colors.error : colors.warning;
  return (
    <XStack
      alignItems="flex-start"
      gap={Spacing.sm}
      padding={Spacing.md}
      borderRadius={Radius.md}
      borderWidth={1}
      backgroundColor={accent + "14"}
      borderColor={accent + "40"}
    >
      <BxIcon name="bx-alert" size={15} color={accent} />
      <Text
        color={variant === "error" ? colors.error : colors.textSecondary}
        fontSize={13}
        flex={1}
        lineHeight={18}
      >
        {text}
      </Text>
    </XStack>
  );
};
