import React from "react";
import { Text, View, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Radius } from "@shared/constants/design";

interface PinKeyProps {
  label: string;
  onPress: () => void;
}

export const PinKey = ({ label, onPress }: PinKeyProps) => {
  const colors = useColors();
  if (!label) return <View width={80} height={68} borderRadius={Radius.lg} />;
  return (
    <XStack
      onPress={onPress}
      width={80}
      height={68}
      borderRadius={Radius.lg}
      borderWidth={1}
      borderColor={colors.border}
      backgroundColor={colors.surface}
      alignItems="center"
      justifyContent="center"
      pressStyle={{ opacity: 0.6 }}
    >
      <Text
        fontSize={24}
        fontWeight="300"
        color={label === "⌫" ? colors.error : colors.textPrimary}
      >
        {label}
      </Text>
    </XStack>
  );
};
