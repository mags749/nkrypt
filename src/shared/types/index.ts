// ─── Category ────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "General",
  "Apps",
  "Bank",
  "Card",
  "Shopping",
  "Social",
] as const;

export type Category = (typeof CATEGORIES)[number];

// ─── Folder ───────────────────────────────────────────────────────────────────

export interface Folder {
  id: string;
  name: string;
  category: Category;
  createdAt: number;
  updatedAt: number;
}

export interface FolderWithCount extends Folder {
  fileCount: number;
}

// ─── File ────────────────────────────────────────────────────────────────────

export interface NkryptFile {
  id: string;
  folderId: string;
  key: string;
  value: string; // plaintext OR AES-256-CTR hex (when isEncrypted)
  isEncrypted: boolean;
  isLink: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface NkryptFileDecrypted extends NkryptFile {
  decryptedValue: string; // always plaintext
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthCredentials {
  passPhrase: string;
  passKey: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type AppTheme = "light" | "dark";

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface RootStackParamList {
  "/": undefined;
  "/auth": undefined;
  "/folders": undefined;
  "/folders/[id]": { id: string };
  "/create-folder": undefined;
  "/create-file": { folderId: string };
  "/settings": undefined;
}
