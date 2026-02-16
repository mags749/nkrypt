import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Spacing, Typography } from "@shared/constants/design";

interface MetaGridProps {
  createdAt: number;
  updatedAt: number;
  folderName: string;
}

const MetaCell = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const colors = useColors();
  return (
    <View style={cellStyles.container}>
      <Text style={[cellStyles.label, { color: colors.textTertiary }]}>
        {label}
      </Text>
      {children}
    </View>
  );
};

const cellStyles = StyleSheet.create({
  container: { width: "45%", gap: 4 },
  label: { ...Typography.labelSM, letterSpacing: 0.8 },
});

export const MetaGrid = ({
  createdAt,
  updatedAt,
  folderName,
}: MetaGridProps) => {
  const colors = useColors();
  const createdStr = format(new Date(createdAt), "dd MMM yyyy");
  const modifiedStr = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
  });

  return (
    <View style={[styles.grid, { borderTopColor: colors.separator }]}>
      <MetaCell label="CREATED">
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {createdStr}
        </Text>
      </MetaCell>
      <MetaCell label="MODIFIED">
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {modifiedStr}
        </Text>
      </MetaCell>
      <MetaCell label="ENCRYPTION">
        <View style={styles.encRow}>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            AES-256
          </Text>
          <BxIcon name="bx-lock-alt" size={14} color={colors.textTertiary} />
        </View>
      </MetaCell>
      <MetaCell label="FOLDER">
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {folderName}
        </Text>
      </MetaCell>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Spacing["3xl"],
    paddingTop: Spacing["2xl"],
    borderTopWidth: 1,
    gap: Spacing["2xl"],
  },
  value: { ...Typography.bodyMD, fontWeight: "500" },
  encRow: { flexDirection: "row", alignItems: "center", gap: 4 },
});
