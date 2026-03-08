import React from "react";
import { XStack, YStack } from "tamagui";

import { Spacing } from "@shared/constants/design";
import { PinDots } from "./PinDots";
import { PinKey } from "./PinKey";

interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

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
