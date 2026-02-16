import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";

export const useCreateFile = () => {
  const router = useRouter();
  const { folderId, editId } = useLocalSearchParams<{
    folderId?: string;
    editId?: string;
  }>();
  const { createFile, updateFile, filesByFolder } = useFilesStore();
  const editFile = editId
    ? Object.values(filesByFolder)
        .flat()
        .find((f) => f.id === editId)
    : undefined;
  const isEditing = Boolean(editFile);

  const [site, setSite] = useState(editFile?.site ?? "");
  const [username, setUsername] = useState(editFile?.username ?? "");
  const [credentials, setCredentials] = useState("");
  const [showCreds, setShowCreds] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearErr = (k: string) => setErrors((p) => ({ ...p, [k]: "" }));

  const onSave = async () => {
    const e: Record<string, string> = {};
    if (!site.trim()) e.site = "Site is required";
    if (!username.trim()) e.username = "Username is required";
    if (!isEditing && !credentials.trim())
      e.credentials = "Credentials are required";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setIsLoading(true);
    try {
      if (isEditing && editId)
        await updateFile(editId, {
          site,
          username,
          ...(credentials.trim() ? { credentials } : {}),
        });
      else if (folderId)
        await createFile({ folderId, site, username, credentials });
      router.back();
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Failed to save",
      });
      setIsLoading(false);
    }
  };

  return {
    site,
    setSite,
    username,
    setUsername,
    credentials,
    setCredentials,
    showCreds,
    setShowCreds,
    isLoading,
    errors,
    isEditing,
    clearErr,
    onSave,
    onClose: () => router.back(),
  };
};
