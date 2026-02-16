import React from "react";
import { useFoldersList } from "@features/folders/hooks/useFoldersList";
import { FoldersView } from "@features/folders/views/FoldersView";

export default function FoldersScreen() {
  const hook = useFoldersList();
  return (
    <FoldersView
      folders={hook.folders}
      selectedCategory={hook.selectedCategory}
      selectCategory={hook.setSelectedCategory}
      categories={hook.categories}
      isLoading={hook.isLoading}
      onOpenFolder={hook.onOpenFolder}
      onEditFolder={hook.onEditFolder}
      onNewFolder={hook.onNewFolder}
      onSettings={hook.onSettings}
    />
  );
}
