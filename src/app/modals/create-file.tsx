import React from "react";
import { useCreateFile } from "@features/modals/hooks/useCreateFile";
import { CreateFileView } from "@features/modals/views/CreateFileView";

export default function CreateFileModal() {
  const hook = useCreateFile();
  return (
    <CreateFileView
      isEditing={hook.isEditing}
      site={hook.site}
      onSiteChange={(v) => {
        hook.setSite(v);
        hook.clearErr("site");
      }}
      username={hook.username}
      onUsernameChange={(v) => {
        hook.setUsername(v);
        hook.clearErr("username");
      }}
      credentials={hook.credentials}
      onCredentialsChange={(v) => {
        hook.setCredentials(v);
        hook.clearErr("credentials");
      }}
      showCreds={hook.showCreds}
      onToggleCreds={() => hook.setShowCreds((v) => !v)}
      isLoading={hook.isLoading}
      errors={hook.errors}
      onSave={() => {
        void hook.onSave();
      }}
      onClose={hook.onClose}
    />
  );
}
