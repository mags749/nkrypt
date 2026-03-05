import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useFoldersStore } from "@features/folders/store/foldersStore";

export const useFolderDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const folder = useFoldersStore((s) => s.getFolderById(id));
  const { filesByFolder, loadFilesForFolder, deleteFile } = useFilesStore();
  const files = filesByFolder[id] ?? [];
  const [openMoreOptionSheet, setMoreOptionVisibility] =
    useState<boolean>(false);

  // Delete file dialog state
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);

  // Delete folder dialog state
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);

  useEffect(() => {
    if (id) void loadFilesForFolder(id);
  }, [id]);

  const onFilePress = useCallback(
    (fileId: string) => router.push(`/files/${fileId}`),
    [router],
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

  const onMoreOptions = useCallback(() => {
    setMoreOptionVisibility(true);
  }, []);

  return {
    folder,
    files,
    id,
    onFilePress,
    onDeleteFile,
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
