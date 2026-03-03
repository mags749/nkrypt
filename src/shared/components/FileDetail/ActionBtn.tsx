import React from "react";
import { XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon, type BxIconName } from "@shared/components/BxIcon";

interface ActionBtnProps {
  icon: BxIconName;
  onPress: () => void;
  colorOverride?: string;
}

export const ActionBtn = ({ icon, onPress, colorOverride }: ActionBtnProps) => {
  const colors = useColors();
  return (
    <XStack
      onPress={onPress}
      width={40}
      height={40}
      borderRadius={20}
      backgroundColor={colorOverride ?? colors.accent}
      alignItems="center"
      justifyContent="center"
      pressStyle={{ opacity: 0.75 }}
    >
      <BxIcon name={icon} size={17} color={colors.accentForeground} />
    </XStack>
  );
};
