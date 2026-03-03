/**
 * Ephemeral in-memory store that holds decrypted values after PassKey verification.
 * The passkey-prompt modal writes here; FileDetailView reads from here.
 * Values are cleared when the user navigates away or hides them.
 */
import { create } from "zustand";

interface RevealState {
  fileId: string | null;
  decryptedCredentials: string | null;
  decryptedUsername: string | null;
  setRevealed: (
    fileId: string,
    credentials: string | null,
    username: string | null,
  ) => void;
  clearRevealed: () => void;
}

export const useRevealStore = create<RevealState>((set) => ({
  fileId: null,
  decryptedCredentials: null,
  decryptedUsername: null,
  setRevealed: (fileId, credentials, username) =>
    set({
      fileId,
      decryptedCredentials: credentials,
      decryptedUsername: username,
    }),
  clearRevealed: () =>
    set({ fileId: null, decryptedCredentials: null, decryptedUsername: null }),
}));
