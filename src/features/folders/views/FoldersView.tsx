import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { FolderCard } from "@features/folders/views/FolderCard";
import { FoldersEmptyState } from "@features/folders/views/FoldersEmptyState";
import { Shadow, Spacing } from "@shared/constants/design";
import type { FolderWithCount } from "@shared/types";
import CategoryList from "@shared/components/CategoryList";
import { Category } from "@features/categories/store/categoryStore";
import { Separator } from "tamagui";

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
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <XStack
        alignItems="center"
        justifyContent="flex-end"
        paddingHorizontal={Spacing["2xl"]}
        paddingVertical={Spacing.lg}
      >
        <XStack onPress={onSettings} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-cog" size={22} color={colors.textPrimary} />
        </XStack>
      </XStack>

      <CategoryList
        data={categories}
        selectedCategory={selectedCategory}
        selectCategory={selectCategory}
      />

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <Separator
            alignSelf="stretch"
            borderWidth={0.5}
            borderColor={colors.border}
            marginHorizontal={Spacing["4xl"]}
            marginVertical={Spacing.md}
          />
        )}
        renderItem={({ item }) => (
          <View paddingHorizontal={Spacing.xl} marginBottom={Spacing.sm}>
            <FolderCard
              folder={item}
              onPress={() => onOpenFolder(item.id)}
              onEdit={() => onEditFolder(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={!isLoading ? <FoldersEmptyState /> : null}
      />

      <XStack
        onPress={onNewFolder}
        position="absolute"
        bottom={Spacing["3xl"]}
        right={Spacing["2xl"]}
        width={56}
        height={56}
        borderRadius={28}
        backgroundColor={colors.accent}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ opacity: 0.85 }}
        style={Shadow.lg}
      >
        <BxIcon name="bx-plus" size={26} color={colors.accentForeground} />
      </XStack>
    </SafeAreaView>
  );
};
