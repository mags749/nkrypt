import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { Radius, Spacing, Typography } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";

interface FileItemProps {
  file: NkryptFile;
  onPress: () => void;
  onDelete: () => void;
}

export const FileItem = ({ file, onPress, onDelete }: FileItemProps) => {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.item,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {file.site}
        </Text>
        <Text style={[styles.user, { color: colors.textTertiary }]}>
          {file.username}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onDelete}
        activeOpacity={0.7}
        hitSlop={8}
        style={[styles.deleteBtn, { backgroundColor: colors.surfaceSecondary }]}
      >
        <BxIcon name="bx-trash" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  content: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: "600", letterSpacing: -0.2 },
  user: { ...Typography.bodySM },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
