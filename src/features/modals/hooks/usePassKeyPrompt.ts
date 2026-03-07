import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useToastController } from "@tamagui/toast";
import { useFilesStore } from "@features/files/store/filesStore";
import { useRevealStore } from "@features/files/store/revealStore";
import { useAuthStore } from "@features/auth/store/authStore";
import { verifyHash } from "@infra/crypto/cryptoService";
import { db } from "@infra/database/client";
import { settings } from "@infra/database/schema";

const KEY_KEY_HASH = "passkey_hash";

export const usePassKeyPrompt = () => {
  const router = useRouter();
  const toast = useToastController();
  const { fileId, mode } = useLocalSearchParams<{
    fileId: string;
    mode?: "copy" | "reveal" | "edit";
  }>();
  const { filesByFolder, decryptFileValue } = useFilesStore();
  const file = Object.values(filesByFolder)
    .flat()
    .find((f) => f.id === fileId);

  const { setRevealed } = useRevealStore();
  const { logout } = useAuthStore();

  const [passKey, setPassKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

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

    try {
      const rows = await db.select().from(settings);
      const map: Record<string, string> = {};
      rows.forEach((r) => {
        map[r.key] = r.value;
      });
      const storedHash = map[KEY_KEY_HASH] ?? "";

      if (!verifyHash(passKey.trim(), storedHash)) {
        const newAttempts = attemptCount + 1;
        setAttemptCount(newAttempts);
        setIsLoading(false);
        setPassKey("");

        if (newAttempts >= 3) {
          toast.show("Too many failed attempts. Logging out…", {
            duration: 3000,
          });
          setTimeout(() => {
            logout();
            router.replace("/auth");
          }, 1500);
          return;
        }

        const remaining = 3 - newAttempts;
        toast.show(
          `Incorrect Pass Key. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
          { duration: 3000 },
        );
        setError(`Incorrect Pass Key (${newAttempts}/3 attempts)`);
        return;
      }
    } catch {
      // Fall through to decryption check
    }

    const plaintext = decryptFileValue(file, passKey.trim());
    if (plaintext === null) {
      setIsLoading(false);
      setError("Incorrect Pass Key");
      return;
    }

    if (mode === "copy") {
      await Clipboard.setStringAsync(plaintext);
    } else if (mode === "edit") {
      setIsLoading(false);
      router.replace({
        pathname: "/modals/create-file",
        params: { editId: fileId },
      });
      return;
    } else {
      setRevealed(file.id, plaintext);
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
    attemptCount,
  };
};
