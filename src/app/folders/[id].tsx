import React from "react";
import { useFolderDetail } from "@features/folders/hooks/useFolderDetail";
import { FolderDetailView } from "@features/folders/views/FolderDetailView";

export default function FolderDetailScreen() {
  const hook = useFolderDetail();
  return (
    <FolderDetailView
      folderName={hook.folder?.name ?? "Files"}
      files={hook.files}
      onBack={hook.onBack}
      onMoreOptions={hook.onMoreOptions}
      onFilePress={hook.onFilePress}
      onDeleteFile={hook.onDeleteFile}
      onNewFile={hook.onNewFile}
    />
  );
}
