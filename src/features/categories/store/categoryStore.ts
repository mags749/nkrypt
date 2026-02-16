import { create } from "zustand";
import { eq } from "drizzle-orm";
import { db } from "@infra/database/client";
import { categories as categoriesTable } from "@infra/database/schema";
import { nanoid } from "nanoid/non-secure";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  color: string | null;
  isDefault: boolean;
  sortOrder: number;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;

  loadCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  renameCategory: (id: string, name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  getCategoryNames: () => string[];
}

// ─── Default colors ───────────────────────────────────────────────────────────

const DEFAULT_COLORS: Record<string, string> = {
  General: "#71717A",
  Apps: "#3B82F6",
  Bank: "#22C55E",
  Card: "#A855F7",
  Shopping: "#F97316",
  Social: "#EC4899",
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const rows = await db
        .select()
        .from(categoriesTable)
        .orderBy(categoriesTable.sortOrder);

      // Seed defaults if empty
      if (rows.length === 0) {
        const defaults = [
          "General",
          "Apps",
          "Bank",
          "Card",
          "Shopping",
          "Social",
        ];
        const now = new Date();
        for (let i = 0; i < defaults.length; i++) {
          await db.insert(categoriesTable).values({
            id: nanoid(),
            name: defaults[i],
            color: DEFAULT_COLORS[defaults[i]] ?? null,
            isDefault: true,
            sortOrder: i,
            createdAt: now,
          });
        }
        await get().loadCategories();
        return;
      }

      set({
        categories: rows.map((r) => ({
          id: r.id,
          name: r.name,
          color: r.color,
          isDefault: Boolean(r.isDefault),
          sortOrder: r.sortOrder,
        })),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addCategory: async (name: string) => {
    const now = new Date();
    const sortOrder = get().categories.length;
    await db.insert(categoriesTable).values({
      id: nanoid(),
      name,
      color: null,
      isDefault: false,
      sortOrder,
      createdAt: now,
    });
    await get().loadCategories();
  },

  renameCategory: async (id: string, name: string) => {
    await db
      .update(categoriesTable)
      .set({ name })
      .where(eq(categoriesTable.id, id));
    await get().loadCategories();
  },

  removeCategory: async (id: string) => {
    // TODO: move folders in this category to 'General'
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    await get().loadCategories();
  },

  getCategoryNames: () => get().categories.map((c) => c.name),
}));
