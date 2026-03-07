import { useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
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
    decryptedValue,
    clearRevealed,
  } = useRevealStore();

  const isThisFileRevealed = revealedFileId === id;
  const valueRevealed = isThisFileRevealed && decryptedValue !== null;

  const onReveal = useCallback(() => {
    if (!file) return;
    if (!file.isEncrypted) return; // plaintext — nothing to reveal
    if (valueRevealed) {
      clearRevealed();
    } else {
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "reveal" },
      });
    }
  }, [valueRevealed, id, file, router, clearRevealed]);

  const onCopyValue = useCallback(() => {
    if (!file) return;
    if (!file.isEncrypted) {
      void Clipboard.setStringAsync(file.value);
    } else if (valueRevealed && decryptedValue) {
      void Clipboard.setStringAsync(decryptedValue);
    } else {
      router.push({
        pathname: "/modals/passkey-prompt",
        params: { fileId: id, mode: "copy" },
      });
    }
  }, [valueRevealed, decryptedValue, id, file, router]);

  const onOpenLink = useCallback(() => {
    if (!file) return;
    const url = valueRevealed && decryptedValue ? decryptedValue : file.value;
    const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    void Linking.openURL(finalUrl);
  }, [file, valueRevealed, decryptedValue]);

  const onCopyField = useCallback(
    (value: string) => void Clipboard.setStringAsync(value),
    [],
  );

  return {
    file,
    folder,
    id,
    valueRevealed,
    decryptedValue,
    onReveal,
    onCopyValue,
    onOpenLink,
    onCopyField,
    onBack: () => router.back(),
    onEdit: () => {
      if (file?.isEncrypted) {
        router.push({
          pathname: "/modals/passkey-prompt",
          params: { fileId: id, mode: "edit" },
        });
      } else {
        router.push({
          pathname: "/modals/create-file",
          params: { editId: id },
        });
      }
    },
    onNewFile: () =>
      file &&
      router.push({
        pathname: "/modals/create-file",
        params: { folderId: file.folderId },
      }),
  };
};
