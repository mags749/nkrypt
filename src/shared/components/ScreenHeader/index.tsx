import React from "react";
import { Text, View, XStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing } from "@shared/constants/design";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}

export const ScreenHeader = ({ title, onBack, right }: ScreenHeaderProps) => {
  const colors = useColors();
  return (
    <XStack
      flexDirection="row"
      alignItems="center"
      paddingHorizontal={Spacing.lg}
      paddingVertical={Spacing.md}
    >
      <XStack
        onPress={onBack}
        width={34}
        alignItems="center"
        pressStyle={{ opacity: 0.7 }}
      >
        <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
      </XStack>
      <Text
        flex={1}
        textAlign="center"
        fontSize={20}
        fontWeight="600"
        letterSpacing={-0.3}
        color={colors.textPrimary}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View width={34} alignItems="center">
        {right ?? null}
      </View>
    </XStack>
  );
};
