import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { FileItem } from "@features/folders/views/FileItem";
import { Shadow, Spacing, Typography } from "@shared/constants/design";
import type { NkryptFile } from "@shared/types";

interface FolderDetailViewProps {
  folderName: string;
  files: NkryptFile[];
  onBack: () => void;
  onMoreOptions: () => void;
  onFilePress: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onNewFile: () => void;
}

export const FolderDetailView = ({
  folderName,
  files,
  onBack,
  onMoreOptions,
  onFilePress,
  onDeleteFile,
  onNewFile,
}: FolderDetailViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <BxIcon name="bx-chevron-left" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {folderName}
        </Text>
        <TouchableOpacity onPress={onMoreOptions} activeOpacity={0.7}>
          <BxIcon
            name="bx-dots-horizontal-rounded"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <FileItem
            file={item}
            onPress={() => onFilePress(item.id)}
            onDelete={() => onDeleteFile(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              {"No files in this folder.\nTap + to add one."}
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }, Shadow.lg]}
        onPress={onNewFile}
        activeOpacity={0.85}
      >
        <BxIcon name="bx-plus" size={26} color={colors.accentForeground} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  title: { flex: 1, fontSize: 20, fontWeight: "600", letterSpacing: -0.3 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  empty: { alignItems: "center", paddingTop: 80 },
  emptyText: { ...Typography.bodyMD, textAlign: "center", lineHeight: 24 },
  fab: {
    position: "absolute",
    bottom: Spacing["3xl"],
    right: Spacing["2xl"],
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
