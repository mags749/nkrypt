import React from "react";
import { Text, View, XStack, YStack } from "tamagui";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { BlurModal } from "@shared/components/BlurModal";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Radius, Spacing } from "@shared/constants/design";

interface CreateFolderViewProps {
  isEditing: boolean;
  name: string;
  onNameChange: (v: string) => void;
  category: string;
  onCategorySelect: (v: string) => void;
  pickerOpen: boolean;
  onTogglePicker: () => void;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  onClose: () => void;
}

export const CreateFolderView = ({
  isEditing,
  name,
  onNameChange,
  category,
  onCategorySelect,
  pickerOpen,
  onTogglePicker,
  categories,
  isLoading,
  error,
  onSave,
  onClose,
}: CreateFolderViewProps) => {
  const colors = useColors();
  return (
    <BlurModal visible onDismiss={onClose} position="flex-end">
      <LoadingOverlay
        visible={isLoading}
        message={isEditing ? "Updating folder…" : "Creating folder…"}
      />

      <XStack
        alignItems="flex-start"
        justifyContent="space-between"
        marginBottom={Spacing["2xl"]}
        gap={Spacing.md}
      >
        <YStack flex={1} gap={Spacing.xs}>
          <Text
            fontSize={22}
            fontWeight="700"
            letterSpacing={-0.3}
            color={colors.textPrimary}
          >
            {isEditing ? "Edit Folder" : "Create Folder"}
          </Text>
          <Text fontSize={15} color={colors.textSecondary}>
            {isEditing
              ? "Update the folder name or category."
              : "Give your folder a name and category."}
          </Text>
        </YStack>
        <XStack onPress={onClose} pressStyle={{ opacity: 0.7 }}>
          <BxIcon name="bx-x" size={22} color={colors.textSecondary} />
        </XStack>
      </XStack>

      <InputField
        label="Folder Name"
        value={name}
        onChangeText={onNameChange}
        placeholder="e.g. Personal Finance"
        autoFocus
        error={error ?? undefined}
      />

      <YStack marginBottom={Spacing.xl}>
        <Text
          color={colors.textTertiary}
          fontSize={11}
          fontWeight="600"
          letterSpacing={1.0}
          marginBottom={Spacing.sm}
        >
          CATEGORY
        </Text>
        <XStack
          onPress={onTogglePicker}
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={Spacing.sm}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
          pressStyle={{ opacity: 0.7 }}
        >
          <Text fontSize={17} color={colors.textPrimary}>
            {category}
          </Text>
          <BxIcon
            name={pickerOpen ? "bx-chevron-up" : "bx-chevron-down"}
            size={20}
            color={colors.textSecondary}
          />
        </XStack>
      </YStack>

      {pickerOpen && (
        <YStack
          borderRadius={Radius.md}
          borderWidth={1}
          borderColor={colors.border}
          overflow="hidden"
          marginTop={Spacing.sm}
          marginBottom={Spacing.lg}
          backgroundColor={colors.surface}
        >
          {categories.map((cat, i) => (
            <XStack
              key={cat}
              onPress={() => onCategorySelect(cat)}
              alignItems="center"
              padding={Spacing.lg}
              gap={Spacing.md}
              borderBottomWidth={i < categories.length - 1 ? 1 : 0}
              borderBottomColor={colors.separator}
              pressStyle={{ opacity: 0.7 }}
            >
              <XStack
                width={22}
                height={22}
                borderRadius={4}
                borderWidth={1.5}
                borderColor={category === cat ? colors.accent : colors.border}
                backgroundColor={
                  category === cat ? colors.accent : "transparent"
                }
                alignItems="center"
                justifyContent="center"
              >
                {category === cat && (
                  <BxIcon
                    name="bx-check"
                    size={13}
                    color={colors.accentForeground}
                  />
                )}
              </XStack>
              <Text fontSize={15} fontWeight="500" color={colors.textPrimary}>
                {cat}
              </Text>
            </XStack>
          ))}
        </YStack>
      )}

      <XStack
        alignItems="center"
        justifyContent="flex-end"
        gap={Spacing.lg}
        marginTop={Spacing.sm}
      >
        <XStack onPress={onClose} pressStyle={{ opacity: 0.7 }}>
          <Text
            color={colors.textSecondary}
            fontSize={12}
            fontWeight="600"
            letterSpacing={1.5}
          >
            CANCEL
          </Text>
        </XStack>
        <Button
          label={isEditing ? "Update" : "Save"}
          onPress={onSave}
          loading={isLoading}
          loadingLabel="Saving…"
          size="md"
        />
      </XStack>
    </BlurModal>
  );
};
