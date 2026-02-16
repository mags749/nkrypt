import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCategoryStore } from "@features/categories/store/categoryStore";

export const useCategories = () => {
  const router = useRouter();
  const { categories, addCategory, removeCategory, renameCategory } =
    useCategoryStore();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const onAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (
      categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      Alert.alert("Duplicate", "A category with this name already exists.");
      return;
    }
    addCategory(trimmed);
    setNewName("");
  };

  const onStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };
  const onSaveEdit = () => {
    if (editingId && editValue.trim())
      renameCategory(editingId, editValue.trim());
    setEditingId(null);
    setEditValue("");
  };
  const onDelete = (id: string, name: string, isDefault: boolean) => {
    if (isDefault) {
      Alert.alert("Cannot Delete", `"${name}" is a default category.`);
      return;
    }
    Alert.alert(
      `Delete "${name}"?`,
      "Folders in this category will move to General.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeCategory(id),
        },
      ],
    );
  };

  return {
    categories,
    newName,
    setNewName,
    editingId,
    editValue,
    setEditValue,
    onAdd,
    onStartEdit,
    onSaveEdit,
    onDelete,
    onBack: () => router.back(),
  };
};
