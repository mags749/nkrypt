import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useAuthStore } from "@features/auth/store/authStore";

export const useCreateFile = () => {
  const router = useRouter();
  const { folderId, editId } = useLocalSearchParams<{
    folderId?: string;
    editId?: string;
  }>();
  const { createFile, updateFile, filesByFolder, decryptFileValue } =
    useFilesStore();

  const editFile = editId
    ? Object.values(filesByFolder)
        .flat()
        .find((f) => f.id === editId)
    : undefined;
  const isEditing = Boolean(editFile);

  // Pre-fill value for edit: decrypt if needed
  const getInitialValue = () => {
    if (!editFile) return "";
    if (!editFile.isEncrypted) return editFile.value;
    const passKey = useAuthStore.getState().getPassKey();
    if (!passKey) return "";
    return decryptFileValue(editFile, passKey) ?? "";
  };

  const [key, setKey] = useState(editFile?.key ?? "");
  const [value, setValue] = useState(() => getInitialValue());
  const [isEncrypted, setIsEncrypted] = useState(
    editFile ? editFile.isEncrypted : true,
  );
  const [isLink, setIsLink] = useState(editFile?.isLink ?? false);
  const [showValue, setShowValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSave = async () => {
    const e: Record<string, string> = {};
    if (!key.trim()) e.key = "Key is required";
    if (!isEditing && !value.trim()) e.value = "Value is required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      if (isEditing && editId) {
        await updateFile(editId, {
          key,
          ...(value.trim() ? { value } : {}),
          isEncrypted,
          isLink,
        });
      } else if (folderId) {
        await createFile({ folderId, key, value, isEncrypted, isLink });
      }
      router.back();
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Failed to save",
      });
      setIsLoading(false);
    }
  };

  return {
    key,
    setKey,
    value,
    setValue,
    isEncrypted,
    setIsEncrypted,
    isLink,
    setIsLink,
    showValue,
    setShowValue,
    isLoading,
    errors,
    isEditing,
    onSave,
    onClose: () => router.back(),
  };
};
