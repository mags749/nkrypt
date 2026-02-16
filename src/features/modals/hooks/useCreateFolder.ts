import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFoldersStore } from "@features/folders/store/foldersStore";
import { useCategoryStore } from "@features/categories/store/categoryStore";

export const useCreateFolder = () => {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { createFolder, updateFolder, getFolderById } = useFoldersStore();
  const { categories } = useCategoryStore();
  const editFolder = editId ? getFolderById(editId) : undefined;
  const isEditing = Boolean(editFolder);

  const [name, setName] = useState(editFolder?.name ?? "");
  const [category, setCategory] = useState(editFolder?.category ?? "General");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const onSave = async () => {
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }
    setIsLoading(true);
    try {
      if (isEditing && editId) await updateFolder(editId, name, category);
      else await createFolder(name, category);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    category,
    setCategory,
    isLoading,
    error,
    setError,
    pickerOpen,
    setPickerOpen,
    isEditing,
    categories: categories.map((c) => c.name),
    onSave,
    onClose: () => router.back(),
  };
};
