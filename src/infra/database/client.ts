import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

import * as schema from "./schema";

// ─── Singleton ────────────────────────────────────────────────────────────────

const sqlite = SQLite.openDatabaseSync("nkrypt.db", {
  enableChangeListener: true,
});
export const db = drizzle(sqlite, { schema });

// ─── Bootstrap: CREATE TABLE IF NOT EXISTS ────────────────────────────────────
// Runs raw SQL so the app works on first install without running drizzle-kit.
// Also handles schema evolution by running ALTER TABLE ADD COLUMN IF NOT EXISTS
// for any new columns added to existing tables.

export async function bootstrapDatabase(): Promise<void> {
  try {
    // Enable WAL mode for better concurrent performance
    sqlite.execSync("PRAGMA journal_mode = WAL;");
    sqlite.execSync("PRAGMA foreign_keys = ON;");

    // Create tables that don't exist yet
    sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS categories (
        id          TEXT PRIMARY KEY NOT NULL,
        name        TEXT NOT NULL,
        color       TEXT,
        is_default  INTEGER NOT NULL DEFAULT 0,
        sort_order  INTEGER NOT NULL DEFAULT 0,
        created_at  INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS folders (
        id          TEXT PRIMARY KEY NOT NULL,
        name        TEXT NOT NULL,
        category    TEXT NOT NULL DEFAULT 'General',
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS files (
        id                    TEXT PRIMARY KEY NOT NULL,
        folder_id             TEXT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
        site                  TEXT NOT NULL,
        username              TEXT NOT NULL,
        encrypted_credentials TEXT NOT NULL,
        created_at            INTEGER NOT NULL,
        updated_at            INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key        TEXT PRIMARY KEY NOT NULL,
        value      TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // ── Schema migrations (idempotent) ───────────────────────────────────────
    // If a column already exists, SQLite will throw — we catch per-column.
    const migrations: Array<{ sql: string; description: string }> = [
      // Future migrations go here, e.g.:
      // { sql: 'ALTER TABLE folders ADD COLUMN icon TEXT', description: 'folders.icon' },
    ];

    for (const migration of migrations) {
      try {
        sqlite.execSync(migration.sql);
      } catch {
        // Column already exists or other benign error — skip
      }
    }

    console.warn("[DB] Bootstrap complete");
  } catch (error) {
    console.error("[DB] Bootstrap failed:", error);
    throw error;
  }
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkDbHealth(): Promise<boolean> {
  try {
    await db.select().from(schema.settings).limit(1);
    return true;
  } catch {
    return false;
  }
}
