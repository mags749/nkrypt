/**
 * Ephemeral in-memory store that holds the decrypted value after PassKey verification.
 * The passkey-prompt modal writes here; FolderDetailView reads from here.
 * Values are cleared when the user hides them, navigates away, or after AUTO_HIDE_MS.
 */
import { create } from "zustand";

/** Revealed values are automatically hidden after this delay (ms). */
const AUTO_HIDE_MS = 5_000;

interface RevealState {
  fileId: string | null;
  decryptedValue: string | null;
  /** Remaining seconds until auto-hide (null when nothing is revealed). */
  secondsLeft: number | null;
  setRevealed: (fileId: string, value: string) => void;
  clearRevealed: () => void;
}

let _autoHideTimeout: ReturnType<typeof setTimeout> | null = null;
let _countdownInterval: ReturnType<typeof setInterval> | null = null;

function clearTimers() {
  if (_autoHideTimeout !== null) {
    clearTimeout(_autoHideTimeout);
    _autoHideTimeout = null;
  }
  if (_countdownInterval !== null) {
    clearInterval(_countdownInterval);
    _countdownInterval = null;
  }
}

export const useRevealStore = create<RevealState>((set) => ({
  fileId: null,
  decryptedValue: null,
  secondsLeft: null,

  setRevealed: (fileId, value) => {
    clearTimers();

    const totalSeconds = Math.ceil(AUTO_HIDE_MS / 1000);
    set({ fileId, decryptedValue: value, secondsLeft: totalSeconds });

    // Tick down every second
    let remaining = totalSeconds;
    _countdownInterval = setInterval(() => {
      remaining -= 1;
      set({ secondsLeft: remaining > 0 ? remaining : 0 });
    }, 1000);

    // Auto-clear after full delay
    _autoHideTimeout = setTimeout(() => {
      clearTimers();
      set({ fileId: null, decryptedValue: null, secondsLeft: null });
    }, AUTO_HIDE_MS);
  },

  clearRevealed: () => {
    clearTimers();
    set({ fileId: null, decryptedValue: null, secondsLeft: null });
  },
}));
