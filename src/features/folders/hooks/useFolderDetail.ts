import { useCallback, useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useFoldersStore } from "@features/folders/store/foldersStore";
import { useRevealStore } from "@features/files/store/revealStore";

export const useFolderDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const folder = useFoldersStore((s) => s.getFolderById(id));
  const { filesByFolder, loadFilesForFolder, deleteFile, decryptFileValue } =
    useFilesStore();
  const files = filesByFolder[id] ?? [];
  const [openMoreOptionSheet, setMoreOptionVisibility] =
    useState<boolean>(false);

  // Delete file dialog state
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);

  // Delete folder dialog state
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);

  const {
    fileId: revealedFileId,
    decryptedValue,
    clearRevealed,
  } = useRevealStore();

  useEffect(() => {
    if (id) void loadFilesForFolder(id);
  }, [id]);

  /**
   * Tapping the label/value area on an encrypted file → verify passkey then edit.
   * Tapping on a plain file → open edit directly.
   */
  const onFilePress = useCallback(
    (fileId: string) => {
      const file = (filesByFolder[id] ?? []).find((f) => f.id === fileId);
      if (file?.isEncrypted) {
        router.push({
          pathname: "/modals/passkey-prompt",
          params: { fileId, mode: "edit" },
        });
      } else {
        router.push({
          pathname: "/modals/create-file",
          params: { editId: fileId },
        });
      }
    },
    [router, filesByFolder, id],
  );

  /** Reveal / hide toggle for an encrypted file row — always requires passkey */
  const onFileReveal = useCallback(
    (fileId: string) => {
      // If already revealed, hide it
      if (revealedFileId === fileId) {
        clearRevealed();
        return;
      }
      // Always prompt for passkey before revealing
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId, mode: "reveal" },
      });
    },
    [revealedFileId, clearRevealed, router],
  );

  /** Copy file value — prompt passkey if encrypted and not yet revealed */
  const onFileCopy = useCallback(
    (fileId: string) => {
      const file = (filesByFolder[id] ?? []).find((f) => f.id === fileId);
      if (!file) return;

      if (!file.isEncrypted) {
        void Clipboard.setStringAsync(file.value);
        return;
      }

      // Already revealed? Copy directly
      if (revealedFileId === fileId && decryptedValue !== null) {
        void Clipboard.setStringAsync(decryptedValue);
        return;
      }

      // Try session key
      const plain = decryptFileValue(file);
      if (plain !== null) {
        void Clipboard.setStringAsync(plain);
      } else {
        router.push({
          pathname: "/modals/passkey-prompt",
          params: { fileId, mode: "copy" },
        });
      }
    },
    [
      filesByFolder,
      id,
      revealedFileId,
      decryptedValue,
      decryptFileValue,
      router,
    ],
  );

  /** Open link value as URL */
  const onFileOpenLink = useCallback(
    (fileId: string) => {
      const file = (filesByFolder[id] ?? []).find((f) => f.id === fileId);
      if (!file) return;
      const url = file.value;
      const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      void Linking.openURL(finalUrl);
    },
    [filesByFolder, id],
  );

  const onDeleteFile = useCallback((fileId: string) => {
    setDeleteFileId(fileId);
    setDeleteFileDialogOpen(true);
  }, []);

  const onConfirmDeleteFile = useCallback(() => {
    if (deleteFileId) {
      void deleteFile(deleteFileId, id);
    }
    setDeleteFileDialogOpen(false);
    setDeleteFileId(null);
  }, [deleteFileId, id, deleteFile]);

  const onConfirmDeleteFolder = useCallback(async () => {
    setDeleteFolderDialogOpen(false);
    setMoreOptionVisibility(false);
    await useFoldersStore.getState().deleteFolder(id);
    router.back();
  }, [id, router]);

  return {
    folder,
    files,
    id,
    // Per-file actions
    onFilePress,
    onFileReveal,
    onFileCopy,
    onFileOpenLink,
    onDeleteFile,
    // Reveal state
    revealedFileId,
    decryptedValue,
    // Folder UI
    openMoreOptionSheet,
    onMoreOptions: (value: boolean) => setMoreOptionVisibility(value),
    onBack: () => router.back(),
    onNewFile: () =>
      router.push({
        pathname: "/modals/create-file",
        params: { folderId: id },
      }),
    onEditFolder: () => {
      setMoreOptionVisibility(false);
      router.push({
        pathname: "/modals/create-folder",
        params: { editId: id },
      });
    },
    onDeleteFolder: () => {
      setMoreOptionVisibility(false);
      setDeleteFolderDialogOpen(true);
    },
    // Delete file dialog
    deleteFileDialogOpen,
    setDeleteFileDialogOpen,
    onConfirmDeleteFile,
    // Delete folder dialog
    deleteFolderDialogOpen,
    setDeleteFolderDialogOpen,
    onConfirmDeleteFolder,
  };
};
