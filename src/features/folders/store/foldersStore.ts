import { create } from "zustand";
import { eq, count, desc } from "drizzle-orm";
import { nanoid } from "nanoid/non-secure";
import { db } from "@infra/database/client";
import { folders, files } from "@infra/database/schema";
import type { FolderWithCount, Category } from "@shared/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FoldersState {
  // State
  folders: FolderWithCount[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFolders: () => Promise<void>;
  createFolder: (name: string, category: Category) => Promise<string>;
  updateFolder: (id: string, name: string, category: Category) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  getFolderById: (id: string) => FolderWithCount | undefined;
}

// ─── Folders Store ────────────────────────────────────────────────────────────

export const useFoldersStore = create<FoldersState>((set, get) => ({
  folders: [],
  isLoading: false,
  error: null,

  loadFolders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Join folders with file counts
      const rows = await db
        .select({
          id: folders.id,
          name: folders.name,
          category: folders.category,
          createdAt: folders.createdAt,
          updatedAt: folders.updatedAt,
          fileCount: count(files.id),
        })
        .from(folders)
        .leftJoin(files, eq(files.folderId, folders.id))
        .groupBy(folders.id)
        .orderBy(desc(folders.updatedAt));

      set({
        folders: rows.map((r) => ({
          ...r,
          category: r.category as Category,
          createdAt:
            r.createdAt instanceof Date ? r.createdAt.getTime() : r.createdAt,
          updatedAt:
            r.updatedAt instanceof Date ? r.updatedAt.getTime() : r.updatedAt,
          fileCount: r.fileCount ?? 0,
        })),
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load folders",
        isLoading: false,
      });
    }
  },

  createFolder: async (name: string, category: Category): Promise<string> => {
    const id = nanoid();
    const now = new Date();

    await db.insert(folders).values({
      id,
      name: name.trim(),
      category,
      createdAt: now,
      updatedAt: now,
    });

    await get().loadFolders();
    return id;
  },

  updateFolder: async (
    id: string,
    name: string,
    category: Category,
  ): Promise<void> => {
    const now = new Date();
    await db
      .update(folders)
      .set({ name: name.trim(), category, updatedAt: now })
      .where(eq(folders.id, id));

    await get().loadFolders();
  },

  deleteFolder: async (id: string): Promise<void> => {
    // Cascade delete handled by DB foreign key constraint (onDelete: 'cascade')
    await db.delete(folders).where(eq(folders.id, id));
    await get().loadFolders();
  },

  getFolderById: (id: string) => {
    return get().folders.find((f) => f.id === id);
  },
}));
