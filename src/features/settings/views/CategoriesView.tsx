import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@context/providers/themeStore";
import { BxIcon } from "@shared/components/BxIcon";
import { ScreenHeader } from "@shared/components/ScreenHeader";
import { Radius, Spacing, Typography } from "@shared/constants/design";

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
}: CategoriesViewProps) => {
  const colors = useColors();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScreenHeader title="Categories" onBack={onBack} />
      <View style={[styles.addRow, { borderBottomColor: colors.border }]}>
        <TextInput
          style={[
            styles.addInput,
            { color: colors.textPrimary, borderColor: colors.border },
          ]}
          placeholder="New category name…"
          placeholderTextColor={colors.textTertiary}
          value={newName}
          onChangeText={onNewNameChange}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={onAdd}
        />
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.7}
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
        >
          <BxIcon name="bx-plus" size={22} color={colors.accentForeground} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
        )}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: item.color ?? colors.textTertiary },
                ]}
              />
              {editingId === item.id ? (
                <TextInput
                  style={[
                    styles.editInput,
                    {
                      color: colors.textPrimary,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  value={editValue}
                  onChangeText={onEditValueChange}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={onSaveEdit}
                  onBlur={onSaveEdit}
                />
              ) : (
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>
              )}
              {item.isDefault && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colors.surfaceSecondary },
                  ]}
                >
                  <Text
                    style={[styles.badgeText, { color: colors.textTertiary }]}
                  >
                    DEFAULT
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.actions}>
              {editingId === item.id ? (
                <TouchableOpacity onPress={onSaveEdit} activeOpacity={0.7}>
                  <BxIcon name="bx-check" size={20} color={colors.success} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onStartEdit(item.id, item.name)}
                  activeOpacity={0.7}
                  disabled={item.isDefault}
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
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => onDelete(item.id, item.name, item.isDefault)}
                activeOpacity={0.7}
              >
                <BxIcon
                  name="bx-trash"
                  size={18}
                  color={item.isDefault ? colors.textTertiary : colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingBottom: 60 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  rowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { ...Typography.bodyMD, fontWeight: "500" },
  editInput: {
    flex: 1,
    fontSize: 15,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { ...Typography.labelSM, fontSize: 9 },
  actions: { flexDirection: "row", gap: Spacing.md, alignItems: "center" },
  sep: { height: 1 },
});
