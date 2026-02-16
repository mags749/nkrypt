import React from "react";
import { useCategories } from "@features/settings/hooks/useCategories";
import { CategoriesView } from "@features/settings/views/CategoriesView";

export default function CategoriesScreen() {
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
    />
  );
}
