import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { ActionBtn } from "./ActionBtn";
import { Spacing, Typography } from "@shared/constants/design";

// ─── FieldRow ─────────────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string;
  value: string;
  masked?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
}

export const FieldRow = ({
  label,
  value,
  masked = false,
  revealed = false,
  onReveal,
  onCopy,
  onEdit,
  onOpen,
}: FieldRowProps) => {
  const colors = useColors();
  const displayValue = masked && !revealed ? "• • • • • • • • • • • •" : value;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={[styles.label, { color: colors.textTertiary }]}>
          {label.toUpperCase()}
        </Text>
        <Text
          style={[
            styles.value,
            {
              color:
                masked && !revealed ? colors.textTertiary : colors.textPrimary,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayValue}
        </Text>
      </View>
      <View style={styles.actions}>
        {onEdit && <ActionBtn icon="bx-edit" onPress={onEdit} />}
        {onOpen && <ActionBtn icon="bx-link-external" onPress={onOpen} />}
        {onReveal && (
          <ActionBtn
            icon={!revealed ? "bx-hide" : "bx-show"}
            onPress={onReveal}
          />
        )}
        {onCopy && <ActionBtn icon="bx-copy" onPress={onCopy} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  left: { flex: 1, gap: 6 },
  label: { ...Typography.labelSM, letterSpacing: 1.0 },
  value: { ...Typography.bodyLG, fontWeight: "400" },
  actions: { flexDirection: "row", gap: Spacing.sm },
});
