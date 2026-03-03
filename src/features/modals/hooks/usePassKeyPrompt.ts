import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useRevealStore } from "@features/files/store/revealStore";

export const usePassKeyPrompt = () => {
  const router = useRouter();
  const { fileId, mode } = useLocalSearchParams<{
    fileId: string;
    mode?: "copy" | "reveal" | "copy-username";
  }>();
  const { filesByFolder, decryptFileCredentials, decryptFileUsername } =
    useFilesStore();
  const file = Object.values(filesByFolder)
    .flat()
    .find((f) => f.id === fileId);

  const { setRevealed } = useRevealStore();

  const [passKey, setPassKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    if (!passKey.trim()) {
      setError("Pass Key is required");
      return;
    }
    if (!file) {
      setError("File not found");
      return;
    }
    setIsLoading(true);
    setError(null);
    await new Promise<void>((r) => setTimeout(r, 80));

    const plaintext = decryptFileCredentials(file, passKey.trim());
    if (plaintext === null) {
      setIsLoading(false);
      setError("Incorrect Pass Key");
      return;
    }

    const username = decryptFileUsername(file, passKey.trim());

    if (mode === "copy") {
      await Clipboard.setStringAsync(plaintext);
    } else if (mode === "copy-username") {
      if (username) await Clipboard.setStringAsync(username);
    } else {
      // "reveal" — store decrypted values so FileDetailView can display them
      setRevealed(file.id, plaintext, username);
    }

    setIsLoading(false);
    router.back();
  };

  return {
    passKey,
    setPassKey,
    error,
    setError,
    isLoading,
    mode,
    onConfirm,
    onDismiss: () => router.back(),
  };
};
