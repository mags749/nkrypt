import { useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useFoldersStore } from "@features/folders/store/foldersStore";
import { useRevealStore } from "@features/files/store/revealStore";

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

  const {
    fileId: revealedFileId,
    decryptedCredentials,
    decryptedUsername,
    clearRevealed,
  } = useRevealStore();

  // Only show revealed values for this specific file
  const isThisFileRevealed = revealedFileId === id;
  const credentialsRevealed =
    isThisFileRevealed && decryptedCredentials !== null;
  const usernameRevealed = isThisFileRevealed && decryptedUsername !== null;

  const onReveal = useCallback(() => {
    if (credentialsRevealed) {
      clearRevealed();
    } else {
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "reveal" },
      });
    }
  }, [credentialsRevealed, id, router, clearRevealed]);

  const onRevealUsername = useCallback(() => {
    if (usernameRevealed) {
      clearRevealed();
    } else {
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "reveal" },
      });
    }
  }, [usernameRevealed, id, router, clearRevealed]);

  const onCopyCredentials = useCallback(() => {
    if (credentialsRevealed && decryptedCredentials) {
      void Clipboard.setStringAsync(decryptedCredentials);
    } else {
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "copy" },
      });
    }
  }, [credentialsRevealed, decryptedCredentials, id, router]);

  const onCopyUsername = useCallback(() => {
    if (usernameRevealed && decryptedUsername) {
      void Clipboard.setStringAsync(decryptedUsername);
    } else {
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "copy-username" },
      });
    }
  }, [usernameRevealed, decryptedUsername, id, router]);

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
    usernameRevealed,
    decryptedUsername,
    onReveal,
    onRevealUsername,
    onCopyCredentials,
    onCopyUsername,
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
