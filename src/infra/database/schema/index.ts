import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
  isDefault: integer("is_default", { mode: "boolean" })
    .notNull()
    .default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// ─── Folders ──────────────────────────────────────────────────────────────────

export const folders = sqliteTable("folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("General"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ─── Files ────────────────────────────────────────────────────────────────────
// Each file is a single key/value entry.
// If isEncrypted=1, the value column stores an AES-256-CTR hex cipher text.
// If isLink=1, the (decrypted) value is treated as a URL.

export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  folderId: text("folder_id")
    .notNull()
    .references(() => folders.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  value: text("value").notNull(), // plaintext OR AES-256-CTR hex
  isEncrypted: integer("is_encrypted", { mode: "boolean" })
    .notNull()
    .default(true),
  isLink: integer("is_link", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ─── Settings ─────────────────────────────────────────────────────────────────
// Key/value store. Known keys:
//   passphrase_hash  – AES hash of the PIN used for login verification
//   passkey_hash     – AES hash of the key used for AES-256 encryption
//   setup_complete   – 'true' once initial setup is done
//   eula_accepted    – 'true' once EULA is accepted
//   biometric_mode   – 'true' when device biometrics are used instead of passKey

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────

export type CategoryRow = typeof categories.$inferSelect;
export type FolderRow = typeof folders.$inferSelect;
export type NewFolderRow = typeof folders.$inferInsert;
export type FileRow = typeof files.$inferSelect;
export type NewFileRow = typeof files.$inferInsert;
export type SettingRow = typeof settings.$inferSelect;
