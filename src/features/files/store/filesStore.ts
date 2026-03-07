import { create } from "zustand";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid/non-secure";
import { db } from "@infra/database/client";
import { files } from "@infra/database/schema";
import { encrypt, decrypt } from "@infra/crypto/cryptoService";
import { useAuthStore } from "@features/auth/store/authStore";
import type { NkryptFile } from "@shared/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateFileInput {
  folderId: string;
  key: string;
  value: string; // plaintext – encrypted on write if isEncrypted
  isEncrypted: boolean;
  isLink: boolean;
}

interface UpdateFileInput {
  key?: string;
  value?: string; // plaintext – re-encrypted if isEncrypted
  isEncrypted?: boolean;
  isLink?: boolean;
}

interface FilesState {
  filesByFolder: Record<string, NkryptFile[]>;
  isLoading: boolean;
  error: string | null;

  loadFilesForFolder: (folderId: string) => Promise<void>;
  createFile: (input: CreateFileInput) => Promise<string>;
  updateFile: (id: string, input: UpdateFileInput) => Promise<void>;
  deleteFile: (id: string, folderId: string) => Promise<void>;
  /** Returns plaintext value, or null if decryption fails / no passKey */
  decryptFileValue: (file: NkryptFile, passKey?: string) => string | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFilesStore = create<FilesState>((set, get) => ({
  filesByFolder: {},
  isLoading: false,
  error: null,

  loadFilesForFolder: async (folderId) => {
    set({ isLoading: true, error: null });
    try {
      const rows = await db
        .select()
        .from(files)
        .where(eq(files.folderId, folderId))
        .orderBy(desc(files.updatedAt));

      const mapped: NkryptFile[] = rows.map((r) => ({
        id: r.id,
        folderId: r.folderId,
        key: r.key,
        value: r.value,
        isEncrypted: Boolean(r.isEncrypted),
        isLink: Boolean(r.isLink),
        createdAt:
          r.createdAt instanceof Date ? r.createdAt.getTime() : r.createdAt,
        updatedAt:
          r.updatedAt instanceof Date ? r.updatedAt.getTime() : r.updatedAt,
      }));

      set((s) => ({
        filesByFolder: { ...s.filesByFolder, [folderId]: mapped },
        isLoading: false,
      }));
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to load files",
        isLoading: false,
      });
    }
  },

  createFile: async (input) => {
    let storedValue = input.value;

    if (input.isEncrypted) {
      const passKey = useAuthStore.getState().getPassKey();
      if (!passKey) {
        useAuthStore.getState().logout();
        throw new Error("Session expired. Please log in again.");
      }
      const result = encrypt(input.value, passKey);
      if (!result.success) throw new Error(result.error);
      storedValue = result.data;
    }

    const id = nanoid();
    const now = new Date();

    await db.insert(files).values({
      id,
      folderId: input.folderId,
      key: input.key.trim(),
      value: storedValue,
      isEncrypted: input.isEncrypted,
      isLink: input.isLink,
      createdAt: now,
      updatedAt: now,
    });

    await get().loadFilesForFolder(input.folderId);
    return id;
  },

  updateFile: async (id, input) => {
    const now = new Date();
    const patch: Partial<typeof files.$inferInsert> = { updatedAt: now };

    if (input.key !== undefined) patch.key = input.key.trim();
    if (input.isLink !== undefined) patch.isLink = input.isLink;

    // Determine the effective isEncrypted for this update
    const existingFile = Object.values(get().filesByFolder)
      .flat()
      .find((f) => f.id === id);
    const effectiveEncrypted =
      input.isEncrypted !== undefined
        ? input.isEncrypted
        : (existingFile?.isEncrypted ?? false);

    if (input.isEncrypted !== undefined) patch.isEncrypted = input.isEncrypted;

    if (input.value !== undefined) {
      let storedValue = input.value;
      if (effectiveEncrypted) {
        const passKey = useAuthStore.getState().getPassKey();
        if (!passKey) {
          useAuthStore.getState().logout();
          throw new Error("Session expired. Please log in again.");
        }
        const result = encrypt(input.value, passKey);
        if (!result.success) throw new Error(result.error);
        storedValue = result.data;
      }
      patch.value = storedValue;
    }

    await db.update(files).set(patch).where(eq(files.id, id));

    if (existingFile) await get().loadFilesForFolder(existingFile.folderId);
  },

  deleteFile: async (id, folderId) => {
    await db.delete(files).where(eq(files.id, id));
    await get().loadFilesForFolder(folderId);
  },

  decryptFileValue: (file, passKey) => {
    if (!file.isEncrypted) return file.value;
    const key = passKey ?? useAuthStore.getState().getPassKey();
    if (!key) return null;
    const result = decrypt(file.value, key);
    return result.success ? result.data : null;
  },
}));

// ─── reEncryptAllFiles ────────────────────────────────────────────────────────
// Called by authStore.changePassKey. Re-encrypts all encrypted file values.

export const reEncryptAllFiles = async (
  oldPassKey: string,
  newPassKey: string,
): Promise<void> => {
  const allFiles = await db.select().from(files);

  for (const file of allFiles) {
    if (!file.isEncrypted) continue;

    const decResult = decrypt(file.value, oldPassKey);
    if (!decResult.success) continue;

    const encResult = encrypt(decResult.data, newPassKey);
    if (!encResult.success) continue;

    await db
      .update(files)
      .set({ value: encResult.data, updatedAt: new Date() })
      .where(eq(files.id, file.id));
  }
};
