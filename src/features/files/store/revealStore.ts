/**
 * Ephemeral in-memory store that holds the decrypted value after PassKey verification.
 * The passkey-prompt modal writes here; FolderDetailView reads from here.
 * Values are cleared when the user hides them or navigates away.
 */
import { create } from "zustand";

interface RevealState {
  fileId: string | null;
  decryptedValue: string | null;
  setRevealed: (fileId: string, value: string) => void;
  clearRevealed: () => void;
}

export const useRevealStore = create<RevealState>((set) => ({
  fileId: null,
  decryptedValue: null,
  setRevealed: (fileId, value) => set({ fileId, decryptedValue: value }),
  clearRevealed: () => set({ fileId: null, decryptedValue: null }),
}));
