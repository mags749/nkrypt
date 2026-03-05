import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFilesStore } from "@features/files/store/filesStore";
import { useRevealStore } from "@features/files/store/revealStore";
import { useAuthStore } from "@features/auth/store/authStore";
import { verifyHash } from "@infra/crypto/cryptoService";
import { db } from "@infra/database/client";
import { settings } from "@infra/database/schema";

const KEY_KEY_HASH = "passkey_hash";

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
  const { logout } = useAuthStore();

  const [passKey, setPassKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

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

    // Validate pass key against stored hash before attempting decryption
    try {
      const rows = await db.select().from(settings);
      const map: Record<string, string> = {};
      rows.forEach((r) => { map[r.key] = r.value; });
      const storedHash = map[KEY_KEY_HASH] ?? "";

      if (!verifyHash(passKey.trim(), storedHash)) {
        const newAttempts = attemptCount + 1;
        setAttemptCount(newAttempts);
        setIsLoading(false);
        setPassKey("");

        if (newAttempts >= 3) {
          showToast("Too many failed attempts. Logging out…");
          setTimeout(() => {
            logout();
            router.replace("/auth");
          }, 1500);
          return;
        }

        const remaining = 3 - newAttempts;
        showToast(`Incorrect Pass Key. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`);
        setError(`Incorrect Pass Key (${newAttempts}/3 attempts)`);
        return;
      }
    } catch {
      // If we can't verify, fall through to decryption check
    }

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
    toastVisible,
    toastMessage,
    attemptCount,
  };
};
