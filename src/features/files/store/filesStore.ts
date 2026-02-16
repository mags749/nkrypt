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
  site: string;
  username: string;
  credentials: string; // plaintext → encrypted on write
}

interface UpdateFileInput {
  site?: string;
  username?: string;
  credentials?: string; // plaintext → re-encrypted if provided
}

interface FilesState {
  filesByFolder: Record<string, NkryptFile[]>;
  isLoading: boolean;
  error: string | null;

  loadFilesForFolder: (folderId: string) => Promise<void>;
  createFile: (input: CreateFileInput) => Promise<string>;
  updateFile: (id: string, input: UpdateFileInput) => Promise<void>;
  deleteFile: (id: string, folderId: string) => Promise<void>;
  decryptFileCredentials: (file: NkryptFile, passKey?: string) => string | null;
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
        site: r.site,
        username: r.username,
        encryptedCredentials: r.encryptedCredentials,
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
    const passKey = useAuthStore.getState().getPassKey();
    if (!passKey) {
      useAuthStore.getState().logout();
      throw new Error("Session expired. Please log in again.");
    }

    const result = encrypt(input.credentials, passKey);
    if (!result.success) throw new Error(result.error);

    const id = nanoid();
    const now = new Date();

    await db.insert(files).values({
      id,
      folderId: input.folderId,
      site: input.site.trim(),
      username: input.username.trim(),
      encryptedCredentials: result.data,
      createdAt: now,
      updatedAt: now,
    });

    await get().loadFilesForFolder(input.folderId);
    return id;
  },

  updateFile: async (id, input) => {
    const now = new Date();
    const patch: Partial<typeof files.$inferInsert> = { updatedAt: now };

    if (input.site !== undefined) patch.site = input.site.trim();
    if (input.username !== undefined) patch.username = input.username.trim();

    if (input.credentials !== undefined) {
      const passKey = useAuthStore.getState().getPassKey();
      if (!passKey) {
        // Session expired — trigger logout so the app navigates to login
        useAuthStore.getState().logout();
        throw new Error("Session expired. Please log in again.");
      }

      const result = encrypt(input.credentials, passKey);
      if (!result.success) throw new Error(result.error);
      patch.encryptedCredentials = result.data;
    }

    await db.update(files).set(patch).where(eq(files.id, id));

    const file = Object.values(get().filesByFolder)
      .flat()
      .find((f) => f.id === id);
    if (file) await get().loadFilesForFolder(file.folderId);
  },

  deleteFile: async (id, folderId) => {
    await db.delete(files).where(eq(files.id, id));
    await get().loadFilesForFolder(folderId);
  },

  decryptFileCredentials: (file, passKey) => {
    const key = passKey ?? useAuthStore.getState().getPassKey();
    if (!key) return null;

    const result = decrypt(file.encryptedCredentials, key);
    return result.success ? result.data : null;
  },
}));

// ─── reEncryptAllFiles ────────────────────────────────────────────────────────
// Called by authStore.changePassKey. Iterates every file row and
// decrypts with oldPassKey then re-encrypts with newPassKey.
// This mirrors the original cred.ts re-encryption logic exactly.

export const reEncryptAllFiles = async (
  oldPassKey: string,
  newPassKey: string,
): Promise<void> => {
  const allFiles = await db.select().from(files);

  for (const file of allFiles) {
    const decResult = decrypt(file.encryptedCredentials, oldPassKey);
    if (!decResult.success) continue; // skip entries that can't be decrypted

    const encResult = encrypt(decResult.data, newPassKey);
    if (!encResult.success) continue;

    await db
      .update(files)
      .set({ encryptedCredentials: encResult.data, updatedAt: new Date() })
      .where(eq(files.id, file.id));
  }
};
