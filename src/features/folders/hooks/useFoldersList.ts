import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useFoldersStore } from "@features/folders/store/foldersStore";
import type { FolderWithCount } from "@shared/types";
import {
  Category,
  useCategoryStore,
} from "@features/categories/store/categoryStore";

export const useFoldersList = () => {
  const router = useRouter();
  const { folders, isLoading, loadFolders } = useFoldersStore();
  const { categories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<String | null>(null);

  useEffect(() => {
    void loadFolders();
  }, [loadFolders]);

  const categoriesInFolder = useMemo(() => {
    const filteredCategories: Array<String> = [];
    for (const f of folders) {
      if (!filteredCategories.includes(f.category.toString())) {
        filteredCategories.push(f.category.toString());
      }
    }
    return categories
      .filter(
        (category) => filteredCategories.includes(category.name) && category,
      )
      .sort((cat1: Category, cat2: Category) =>
        cat1.name.localeCompare(cat2.name),
      );
  }, [folders, categories]);

  useEffect(() => {
    if (categoriesInFolder?.length > 0 && !selectedCategory) {
      setSelectedCategory(categoriesInFolder[0].id);
    }
  }, [categoriesInFolder]);

  const selectedFolders = useMemo(() => {
    if (!selectedCategory) {
      return folders.sort((f1: FolderWithCount, f2: FolderWithCount) =>
        f1.name.localeCompare(f2.name),
      );
    }
    const selectedOne = categories.find(
      (category) => category.id === selectedCategory,
    );
    return folders
      .filter(
        (folder: FolderWithCount) =>
          folder.category.toString() === selectedOne?.name,
      )
      .sort((f1: FolderWithCount, f2: FolderWithCount) =>
        f1.name.localeCompare(f2.name),
      );
  }, [selectedCategory, folders]);

  return {
    folders: selectedFolders,
    categories: categoriesInFolder,
    selectedCategory: selectedCategory ?? "",
    setSelectedCategory: (categoryId: String) =>
      setSelectedCategory(categoryId),
    isLoading,
    onOpenFolder: (id: string) => router.push(`/folders/${id}`),
    onEditFolder: (id: string) =>
      router.push({
        pathname: "/modals/create-folder",
        params: { editId: id },
      }),
    onNewFolder: () => router.push("/modals/create-folder"),
    onSettings: () => router.push("/settings"),
  };
};
