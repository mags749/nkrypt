import React from "react";
import { useCreateFolder } from "@features/modals/hooks/useCreateFolder";
import { CreateFolderView } from "@features/modals/views/CreateFolderView";

export default function CreateFolderModal() {
  const hook = useCreateFolder();
  return (
    <CreateFolderView
      isEditing={hook.isEditing}
      name={hook.name}
      onNameChange={(v) => {
        hook.setName(v);
        hook.setError(null);
      }}
      category={hook.category}
      onCategorySelect={(v) => {
        hook.setCategory(v);
        hook.setPickerOpen(false);
      }}
      pickerOpen={hook.pickerOpen}
      onTogglePicker={() => hook.setPickerOpen((v) => !v)}
      categories={hook.categories}
      isLoading={hook.isLoading}
      error={hook.error}
      onSave={() => {
        void hook.onSave();
      }}
      onClose={hook.onClose}
    />
  );
}
