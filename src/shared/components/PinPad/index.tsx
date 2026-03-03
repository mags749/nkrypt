import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { Radius, Spacing } from "@shared/constants/design";

interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const PinDots = ({
  value,
  maxLength,
}: {
  value: string;
  maxLength: number;
}) => {
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

const PinKey = ({ label, onPress }: { label: string; onPress: () => void }) => {
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

export const PinPad = ({ value, onChange, maxLength = 6 }: PinPadProps) => {
  const handlePress = (key: string) => {
    if (key === "⌫") onChange(value.slice(0, -1));
    else if (value.length < maxLength) onChange(value + key);
  };
  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
  return (
    <YStack alignItems="center" gap={Spacing["2xl"]}>
      <PinDots value={value} maxLength={maxLength} />
      <XStack
        flexWrap="wrap"
        gap={Spacing.md}
        justifyContent="center"
        width={264}
      >
        {KEYS.map((key, i) => (
          <PinKey key={i} label={key} onPress={() => handlePress(key)} />
        ))}
      </XStack>
    </YStack>
  );
};
