import React from "react";
import { useCategories } from "@features/settings/hooks/useCategories";
import { CategoriesView } from "@features/settings/views/CategoriesView";

const CategoriesScreen = () => {
  const hook = useCategories();
  return (
    <CategoriesView
      categories={hook.categories}
      newName={hook.newName}
      onNewNameChange={hook.setNewName}
      editingId={hook.editingId}
      editValue={hook.editValue}
      onEditValueChange={hook.setEditValue}
      onAdd={hook.onAdd}
      onStartEdit={hook.onStartEdit}
      onSaveEdit={hook.onSaveEdit}
      onDelete={hook.onDelete}
      onBack={hook.onBack}
      duplicateDialogOpen={hook.duplicateDialogOpen}
      setDuplicateDialogOpen={hook.setDuplicateDialogOpen}
      defaultCategoryDialogOpen={hook.defaultCategoryDialogOpen}
      setDefaultCategoryDialogOpen={hook.setDefaultCategoryDialogOpen}
      deleteDialogOpen={hook.deleteDialogOpen}
      setDeleteDialogOpen={hook.setDeleteDialogOpen}
      pendingDeleteName={hook.pendingDeleteName}
      onConfirmDelete={hook.onConfirmDelete}
    />
  );
};

export default CategoriesScreen;
