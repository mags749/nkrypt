import React from "react";
import { useFileDetail } from "@features/files/hooks/useFileDetail";
import { FileDetailView } from "@features/files/views/FileDetailView";
import { FileNotFound } from "@features/files/views/FileNotFound";

export default function FileDetailScreen() {
  const hook = useFileDetail();
  if (!hook.file) return <FileNotFound />;
  return (
    <FileDetailView
      file={hook.file}
      folderName={hook.folder?.name ?? "—"}
      valueRevealed={hook.valueRevealed}
      decryptedValue={hook.decryptedValue}
      onBack={hook.onBack}
      onEdit={hook.onEdit}
      onNewFile={hook.onNewFile}
      onReveal={hook.onReveal}
      onCopyValue={hook.onCopyValue}
      onOpenLink={hook.onOpenLink}
    />
  );
}
