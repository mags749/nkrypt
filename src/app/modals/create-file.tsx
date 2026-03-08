import React from "react";
import { useCreateFile } from "@features/modals/hooks/useCreateFile";
import { CreateFileView } from "@features/modals/views/CreateFileView";

const CreateFileModal = () => {
  const hook = useCreateFile();
  return (
    <CreateFileView
      isEditing={hook.isEditing}
      fileKey={hook.key}
      onKeyChange={hook.setKey}
      value={hook.value}
      onValueChange={hook.setValue}
      isEncrypted={hook.isEncrypted}
      onEncryptedChange={hook.setIsEncrypted}
      isLink={hook.isLink}
      onLinkChange={hook.setIsLink}
      showValue={hook.showValue}
      onToggleShowValue={() => hook.setShowValue((v) => !v)}
      isLoading={hook.isLoading}
      errors={hook.errors}
      onSave={() => void hook.onSave()}
      onClose={hook.onClose}
    />
  );
};

export default CreateFileModal;
