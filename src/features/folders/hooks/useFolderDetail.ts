import { useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useFoldersStore } from "@features/folders/store/foldersStore";

export const useFolderDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const folder = useFoldersStore((s) => s.getFolderById(id));
  const { filesByFolder, loadFilesForFolder, deleteFile } = useFilesStore();
  const files = filesByFolder[id] ?? [];

  useEffect(() => {
    if (id) void loadFilesForFolder(id);
  }, [id]);

  const onFilePress = useCallback(
    (fileId: string) => router.push(`/files/${fileId}`),
    [router],
  );

  const onDeleteFile = useCallback(
    (fileId: string) => {
      Alert.alert("Delete File", "This action cannot be undone.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void deleteFile(fileId, id),
        },
      ]);
    },
    [id, deleteFile],
  );

  const onMoreOptions = useCallback(() => {
    Alert.alert(folder?.name ?? "Folder", undefined, [
      {
        text: "Edit Folder",
        onPress: () =>
          router.push({
            pathname: "/modals/create-folder",
            params: { editId: id },
          }),
      },
      {
        text: "Delete Folder",
        style: "destructive",
        onPress: () => {
          Alert.alert("Delete Folder", "All files will be deleted too.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await useFoldersStore.getState().deleteFolder(id);
                router.back();
              },
            },
          ]);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [folder, id, router]);

  return {
    folder,
    files,
    id,
    onFilePress,
    onDeleteFile,
    onMoreOptions,
    onBack: () => router.back(),
    onNewFile: () =>
      router.push({
        pathname: "/modals/create-file",
        params: { folderId: id },
      }),
  };
};
