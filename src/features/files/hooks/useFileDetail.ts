import { useCallback, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useFoldersStore } from "@features/folders/store/foldersStore";

export const useFileDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { filesByFolder } = useFilesStore();
  const file = Object.values(filesByFolder)
    .flat()
    .find((f) => f.id === id);
  const folder = useFoldersStore((s) =>
    file ? s.getFolderById(file.folderId) : undefined,
  );

  const [credentialsRevealed, setCredentialsRevealed] = useState(false);
  const [decryptedCredentials, setDecryptedCredentials] = useState<
    string | null
  >(null);

  const onReveal = useCallback(() => {
    if (credentialsRevealed) {
      setCredentialsRevealed(false);
      setDecryptedCredentials(null);
    } else
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "reveal" },
      });
  }, [credentialsRevealed, id, router]);

  const onCopyCredentials = useCallback(() => {
    if (credentialsRevealed && decryptedCredentials)
      void Clipboard.setStringAsync(decryptedCredentials);
    else
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "copy" },
      });
  }, [credentialsRevealed, decryptedCredentials, id, router]);

  const onCopyField = useCallback(
    (value: string) => void Clipboard.setStringAsync(value),
    [],
  );

  return {
    file,
    folder,
    id,
    credentialsRevealed,
    decryptedCredentials,
    onReveal,
    onCopyCredentials,
    onCopyField,
    onBack: () => router.back(),
    onEdit: () =>
      router.push({ pathname: "/modals/create-file", params: { editId: id } }),
    onNewFile: () =>
      file &&
      router.push({
        pathname: "/modals/create-file",
        params: { folderId: file.folderId },
      }),
  };
};
