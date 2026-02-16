import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing, Typography } from "@shared/constants/design";

interface WarningBoxProps {
  text: string;
  variant?: "warning" | "error";
}

export const WarningBox = ({ text, variant = "warning" }: WarningBoxProps) => {
  const colors = useColors();
  const accent = variant === "error" ? colors.error : colors.warning;
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: accent + "14", borderColor: accent + "40" },
      ]}
    >
      <BxIcon name="bx-alert" size={15} color={accent} />
      <Text
        style={[
          styles.text,
          { color: variant === "error" ? colors.error : colors.textSecondary },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  text: { ...Typography.bodySM, flex: 1, lineHeight: 18 },
});
