import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon, type BxIconName } from "@shared/components/BxIcon";
import { Spacing, Typography } from "@shared/constants/design";

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
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.row}
    >
      <View
        style={[styles.badge, { backgroundColor: colors.surfaceSecondary }]}
      >
        <BxIcon
          name={icon}
          size={18}
          color={danger ? colors.error : colors.textPrimary}
        />
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            { color: danger ? colors.error : colors.textPrimary },
          ]}
        >
          {label}
        </Text>
        {sublabel && (
          <Text style={[styles.sublabel, { color: colors.textTertiary }]}>
            {sublabel}
          </Text>
        )}
      </View>
      {rightElement ??
        (onPress && (
          <BxIcon
            name="bx-chevron-right"
            size={18}
            color={colors.textTertiary}
          />
        ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: 2 },
  label: { ...Typography.bodyMD, fontWeight: "500" },
  sublabel: { ...Typography.caption },
});
