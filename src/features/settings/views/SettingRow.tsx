import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon, type BxIconName } from "@shared/components/BxIcon";
import { Spacing } from "@shared/constants/design";

interface SettingRowProps {
  icon: BxIconName;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

export const SettingRow = ({
  icon,
  label,
  sublabel,
  onPress,
  rightElement,
  danger = false,
}: SettingRowProps) => {
  const colors = useColors();
  return (
    <XStack
      onPress={onPress}
      alignItems="center"
      paddingHorizontal={Spacing.lg}
      paddingVertical={Spacing.md}
      gap={Spacing.md}
      pressStyle={onPress ? { opacity: 0.7 } : undefined}
    >
      <XStack
        width={34}
        height={34}
        borderRadius={8}
        backgroundColor={colors.surfaceSecondary}
        alignItems="center"
        justifyContent="center"
      >
        <BxIcon
          name={icon}
          size={18}
          color={danger ? colors.error : colors.textPrimary}
        />
      </XStack>
      <YStack flex={1} gap={2}>
        <Text
          fontSize={15}
          fontWeight="500"
          color={danger ? colors.error : colors.textPrimary}
        >
          {label}
        </Text>
        {sublabel && (
          <Text fontSize={12} color={colors.textTertiary}>
            {sublabel}
          </Text>
        )}
      </YStack>
      {rightElement ??
        (onPress && (
          <BxIcon
            name="bx-chevron-right"
            size={18}
            color={colors.textTertiary}
          />
        ))}
    </XStack>
  );
};
