import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.side}
      >
        <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text
        style={[styles.title, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={styles.side}>{right ?? null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  side: { width: 34, alignItems: "center" },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
});
