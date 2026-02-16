import React from "react";
import {
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { FolderCard } from "@features/folders/views/FolderCard";
import { FoldersEmptyState } from "@features/folders/views/FoldersEmptyState";
import { SectionHeader } from "@shared/components/ui";
import { Radius, Shadow, Spacing } from "@shared/constants/design";
import type { FolderWithCount } from "@shared/types";
import CategoryList, { MenuItem } from "@shared/components/CategoryList";
import { Category } from "@features/categories/store/categoryStore";

interface FoldersViewProps {
  folders: Array<FolderWithCount>;
  categories: Array<Category>;
  selectedCategory: String;
  selectCategory: (categoryId: String) => void;
  isLoading: boolean;
  onOpenFolder: (id: string) => void;
  onEditFolder: (id: string) => void;
  onNewFolder: () => void;
  onSettings: () => void;
}

export const FoldersView = ({
  folders,
  categories,
  selectCategory,
  selectedCategory,
  isLoading,
  onOpenFolder,
  onEditFolder,
  onNewFolder,
  onSettings,
}: FoldersViewProps) => {
  const colors = useColors();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Pressable onPress={onSettings}>
          <BxIcon name="bx-cog" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>
      <CategoryList
        data={categories}
        selectedCategory={selectedCategory}
        selectCategory={selectCategory}
      />
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <FolderCard
              folder={item}
              onPress={() => onOpenFolder(item.id)}
              onEdit={() => onEditFolder(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={!isLoading ? <FoldersEmptyState /> : null}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }, Shadow.lg]}
        onPress={onNewFolder}
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
    justifyContent: "flex-end",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  list: { paddingBottom: 100 },
  itemWrapper: { paddingHorizontal: Spacing.lg },
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
