import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, XStack } from "tamagui";
import { useColors } from "@context/providers/themeStore";

export const FileNotFound = () => {
  const colors = useColors();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <XStack flex={1} alignItems="center" justifyContent="center">
        <Text color={colors.textTertiary}>File not found</Text>
      </XStack>
    </SafeAreaView>
  );
};
