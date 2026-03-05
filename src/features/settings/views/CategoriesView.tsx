import React from "react";
import { FlatList, TextInput as RNTextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertDialog, Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { ScreenHeader } from "@shared/components/ScreenHeader";
import { Button } from "@shared/components/ui";
import { Radius, Spacing } from "@shared/constants/design";

interface Category {
  id: string;
  name: string;
  color?: string | null;
  isDefault: boolean;
}

interface CategoriesViewProps {
  categories: Category[];
  newName: string;
  onNewNameChange: (v: string) => void;
  editingId: string | null;
  editValue: string;
  onEditValueChange: (v: string) => void;
  onAdd: () => void;
  onStartEdit: (id: string, name: string) => void;
  onSaveEdit: () => void;
  onDelete: (id: string, name: string, isDefault: boolean) => void;
  onBack: () => void;
  // Dialog state
  duplicateDialogOpen: boolean;
  setDuplicateDialogOpen: (v: boolean) => void;
  defaultCategoryDialogOpen: boolean;
  setDefaultCategoryDialogOpen: (v: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (v: boolean) => void;
  pendingDeleteName: string;
  onConfirmDelete: () => void;
}

export const CategoriesView = ({
  categories,
  newName,
  onNewNameChange,
  editingId,
  editValue,
  onEditValueChange,
  onAdd,
  onStartEdit,
  onSaveEdit,
  onDelete,
  onBack,
  duplicateDialogOpen,
  setDuplicateDialogOpen,
  defaultCategoryDialogOpen,
  setDefaultCategoryDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  pendingDeleteName,
  onConfirmDelete,
}: CategoriesViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScreenHeader title="Categories" onBack={onBack} />

      <XStack
        alignItems="center"
        gap={Spacing.sm}
        paddingHorizontal={Spacing.lg}
        paddingVertical={Spacing.md}
        borderBottomWidth={1}
        borderBottomColor={colors.border}
      >
        <RNTextInput
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: Spacing.sm,
            borderWidth: 1,
            borderRadius: Radius.md,
            paddingHorizontal: Spacing.md,
            color: colors.textPrimary,
            borderColor: colors.border,
          }}
          placeholder="New category name…"
          placeholderTextColor={colors.textTertiary}
          value={newName}
          onChangeText={onNewNameChange}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={onAdd}
        />
        <XStack
          onPress={onAdd}
          width={44}
          height={44}
          borderRadius={Radius.md}
          backgroundColor={colors.accent}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.7 }}
        >
          <BxIcon name="bx-plus" size={22} color={colors.accentForeground} />
        </XStack>
      </XStack>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View height={1} backgroundColor={colors.border} />
        )}
        renderItem={({ item }) => (
          <XStack
            alignItems="center"
            paddingHorizontal={Spacing.lg}
            paddingVertical={Spacing.md}
            backgroundColor={colors.surface}
          >
            <XStack flex={1} alignItems="center" gap={Spacing.md}>
              <View
                width={10}
                height={10}
                borderRadius={5}
                backgroundColor={item.color ?? colors.textTertiary}
              />
              {editingId === item.id ? (
                <RNTextInput
                  style={{
                    flex: 1,
                    fontSize: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    paddingVertical: 2,
                    color: colors.textPrimary,
                  }}
                  value={editValue}
                  onChangeText={onEditValueChange}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={onSaveEdit}
                  onBlur={onSaveEdit}
                />
              ) : (
                <Text fontSize={15} fontWeight="500" color={colors.textPrimary}>
                  {item.name}
                </Text>
              )}
              {item.isDefault && (
                <XStack
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                  backgroundColor={colors.surfaceSecondary}
                >
                  <Text
                    fontSize={9}
                    fontWeight="500"
                    color={colors.textTertiary}
                  >
                    DEFAULT
                  </Text>
                </XStack>
              )}
            </XStack>
            <XStack gap={Spacing.md} alignItems="center">
              {editingId === item.id ? (
                <XStack onPress={onSaveEdit} pressStyle={{ opacity: 0.7 }}>
                  <BxIcon name="bx-check" size={20} color={colors.success} />
                </XStack>
              ) : (
                <XStack
                  onPress={() => onStartEdit(item.id, item.name)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <BxIcon
                    name="bx-edit"
                    size={18}
                    color={
                      item.isDefault
                        ? colors.textTertiary
                        : colors.textSecondary
                    }
                  />
                </XStack>
              )}
              <XStack
                onPress={() => onDelete(item.id, item.name, item.isDefault)}
                pressStyle={{ opacity: 0.7 }}
              >
                <BxIcon
                  name="bx-trash"
                  size={18}
                  color={item.isDefault ? colors.textTertiary : colors.error}
                />
              </XStack>
            </XStack>
          </XStack>
        )}
      />

      {/* Duplicate category error */}
      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" animation="quick" opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <AlertDialog.Content key="content" animation="quick" enterStyle={{ opacity: 0, scale: 0.95 }} exitStyle={{ opacity: 0, scale: 0.95 }} backgroundColor={colors.surfaceElevated} borderRadius={16} padding={Spacing["2xl"]} maxWidth={340} width="90%">
            <YStack gap={Spacing.md}>
              <AlertDialog.Title color={colors.textPrimary} fontSize={18} fontWeight="700">Duplicate Category</AlertDialog.Title>
              <AlertDialog.Description color={colors.textSecondary} fontSize={14}>A category with this name already exists.</AlertDialog.Description>
              <XStack justifyContent="flex-end" marginTop={Spacing.sm}>
                <AlertDialog.Action asChild>
                  <Button label="OK" size="sm" onPress={() => setDuplicateDialogOpen(false)} />
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      {/* Cannot delete default category */}
      <AlertDialog open={defaultCategoryDialogOpen} onOpenChange={setDefaultCategoryDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" animation="quick" opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <AlertDialog.Content key="content" animation="quick" enterStyle={{ opacity: 0, scale: 0.95 }} exitStyle={{ opacity: 0, scale: 0.95 }} backgroundColor={colors.surfaceElevated} borderRadius={16} padding={Spacing["2xl"]} maxWidth={340} width="90%">
            <YStack gap={Spacing.md}>
              <AlertDialog.Title color={colors.textPrimary} fontSize={18} fontWeight="700">Cannot Delete</AlertDialog.Title>
              <AlertDialog.Description color={colors.textSecondary} fontSize={14}>Default categories cannot be deleted.</AlertDialog.Description>
              <XStack justifyContent="flex-end" marginTop={Spacing.sm}>
                <AlertDialog.Action asChild>
                  <Button label="OK" size="sm" onPress={() => setDefaultCategoryDialogOpen(false)} />
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      {/* Confirm delete category */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" animation="quick" opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <AlertDialog.Content key="content" animation="quick" enterStyle={{ opacity: 0, scale: 0.95 }} exitStyle={{ opacity: 0, scale: 0.95 }} backgroundColor={colors.surfaceElevated} borderRadius={16} padding={Spacing["2xl"]} maxWidth={340} width="90%">
            <YStack gap={Spacing.md}>
              <AlertDialog.Title color={colors.textPrimary} fontSize={18} fontWeight="700">Delete "{pendingDeleteName}"?</AlertDialog.Title>
              <AlertDialog.Description color={colors.textSecondary} fontSize={14}>Folders in this category will move to General.</AlertDialog.Description>
              <XStack gap={Spacing.md} justifyContent="flex-end" marginTop={Spacing.sm}>
                <AlertDialog.Cancel asChild>
                  <Button label="Cancel" variant="ghost" size="sm" onPress={() => setDeleteDialogOpen(false)} />
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button label="Delete" variant="danger" size="sm" onPress={onConfirmDelete} />
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </SafeAreaView>
  );
};
