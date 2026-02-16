import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing, Typography } from "@shared/constants/design";
import type { FolderWithCount } from "@shared/types";

interface FolderCardProps {
  folder: FolderWithCount;
  onPress: () => void;
  onEdit: () => void;
}

export const FolderCard = ({ folder, onPress, onEdit }: FolderCardProps) => {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card]}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {folder.name}
        </Text>
        <Text style={[styles.meta, { color: colors.textTertiary }]}>
          {folder.fileCount === 1 ? "1 file" : `${folder.fileCount} files`}
        </Text>
      </View>
      <TouchableOpacity onPress={onEdit} activeOpacity={0.7} hitSlop={8}>
        <BxIcon name="pencil" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  content: { flex: 1, gap: 4 },
  name: { fontSize: 17, fontWeight: "600", letterSpacing: -0.2 },
  meta: { ...Typography.bodySM },
});
