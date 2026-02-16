import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { BlurModal } from "@shared/components/BlurModal";
import { Button, InputField } from "@shared/components/ui";
import { LoadingOverlay } from "@shared/components/ui/LoadingOverlay";
import { Radius, Spacing, Typography } from "@shared/constants/design";

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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isEditing ? "Edit Folder" : "Create Folder"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isEditing
              ? "Update the folder name or category."
              : "Give your folder a name and category."}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <BxIcon name="bx-x" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Folder Name */}
      <InputField
        label="Folder Name"
        value={name}
        onChangeText={onNameChange}
        placeholder="e.g. Personal Finance"
        autoFocus
        error={error ?? undefined}
      />

      {/* Category Picker */}
      <View style={styles.catSection}>
        <Text style={[styles.catLabel, { color: colors.textTertiary }]}>
          CATEGORY
        </Text>
        <TouchableOpacity
          onPress={onTogglePicker}
          activeOpacity={0.7}
          style={[styles.dropdown, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.dropdownVal, { color: colors.textPrimary }]}>
            {category}
          </Text>
          <BxIcon
            name={pickerOpen ? "bx-chevron-up" : "bx-chevron-down"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {pickerOpen && (
        <View
          style={[
            styles.pickerList,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => onCategorySelect(cat)}
              activeOpacity={0.7}
              style={[
                styles.pickerItem,
                { borderBottomColor: colors.separator },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor:
                      category === cat ? colors.accent : colors.border,
                    backgroundColor:
                      category === cat ? colors.accent : "transparent",
                  },
                ]}
              >
                {category === cat && (
                  <BxIcon
                    name="bx-check"
                    size={13}
                    color={colors.accentForeground}
                  />
                )}
              </View>
              <Text
                style={[styles.pickerText, { color: colors.textPrimary }]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={[styles.cancel, { color: colors.textSecondary }]}>
            CANCEL
          </Text>
        </TouchableOpacity>
        <Button
          label={isEditing ? "Update" : "Save"}
          onPress={onSave}
          loading={isLoading}
          loadingLabel="Saving…"
          size="md"
        />
      </View>
    </BlurModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
    gap: Spacing.md,
  },
  titleBlock: { flex: 1, gap: Spacing.xs },
  title: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  subtitle: { ...Typography.bodyMD },
  catSection: { marginBottom: Spacing.xl },
  catLabel: { ...Typography.labelMD, marginBottom: Spacing.sm },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  dropdownVal: { ...Typography.bodyLG },
  pickerList: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerText: { ...Typography.bodyMD, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  cancel: { ...Typography.labelLG, letterSpacing: 1.5 },
});
