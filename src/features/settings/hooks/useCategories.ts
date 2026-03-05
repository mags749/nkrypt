import { useState } from "react";
import { useRouter } from "expo-router";
import { useCategoryStore } from "@features/categories/store/categoryStore";

export const useCategories = () => {
  const router = useRouter();
  const { categories, addCategory, removeCategory, renameCategory } =
    useCategoryStore();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Dialog state
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [defaultCategoryDialogOpen, setDefaultCategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState("");

  const onAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (
      categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setDuplicateDialogOpen(true);
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
      setDefaultCategoryDialogOpen(true);
      return;
    }
    setPendingDeleteId(id);
    setPendingDeleteName(name);
    setDeleteDialogOpen(true);
  };

  const onConfirmDelete = () => {
    if (pendingDeleteId) removeCategory(pendingDeleteId);
    setDeleteDialogOpen(false);
    setPendingDeleteId(null);
    setPendingDeleteName("");
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
    // Dialog state
    duplicateDialogOpen,
    setDuplicateDialogOpen,
    defaultCategoryDialogOpen,
    setDefaultCategoryDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    pendingDeleteName,
    onConfirmDelete,
  };
};
