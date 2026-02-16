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
  site: string;
  username: string;
  encryptedCredentials: string; // AES-256 encrypted
  createdAt: number;
  updatedAt: number;
}

export interface NkryptFileDecrypted extends Omit<
  NkryptFile,
  "encryptedCredentials"
> {
  credentials: string;
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
  "/files/[id]": { id: string };
  "/create-folder": undefined;
  "/create-file": { folderId: string };
  "/settings": undefined;
}
