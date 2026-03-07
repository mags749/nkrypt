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
// Detects old schema at runtime and migrates to the new key/value structure.

export async function bootstrapDatabase(): Promise<void> {
  try {
    // Enable WAL mode for better concurrent performance
    sqlite.execSync("PRAGMA journal_mode = WAL;");
    sqlite.execSync("PRAGMA foreign_keys = OFF;"); // OFF during migration

    // ── Static tables (never changed) ────────────────────────────────────────
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

      CREATE TABLE IF NOT EXISTS settings (
        key        TEXT PRIMARY KEY NOT NULL,
        value      TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // ── Files table: detect schema version and migrate if needed ─────────────
    const tableInfo = sqlite.getAllSync<{ name: string }>(
      "PRAGMA table_info(files);",
    );
    const columnNames = tableInfo.map((r) => r.name);

    if (columnNames.length === 0) {
      // Fresh install — create new schema directly
      sqlite.execSync(`
        CREATE TABLE files (
          id           TEXT PRIMARY KEY NOT NULL,
          folder_id    TEXT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
          key          TEXT NOT NULL,
          value        TEXT NOT NULL,
          is_encrypted INTEGER NOT NULL DEFAULT 1,
          is_link      INTEGER NOT NULL DEFAULT 0,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL
        );
      `);
    } else if (!columnNames.includes("key")) {
      // Old schema (site/username/encrypted_credentials) — migrate to key/value
      sqlite.execSync("ALTER TABLE files RENAME TO files_old;");

      sqlite.execSync(`
        CREATE TABLE files (
          id           TEXT PRIMARY KEY NOT NULL,
          folder_id    TEXT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
          key          TEXT NOT NULL,
          value        TEXT NOT NULL,
          is_encrypted INTEGER NOT NULL DEFAULT 1,
          is_link      INTEGER NOT NULL DEFAULT 0,
          created_at   INTEGER NOT NULL,
          updated_at   INTEGER NOT NULL
        );
      `);

      // Migrate: site → plaintext link entry
      sqlite.execSync(`
        INSERT INTO files (id, folder_id, key, value, is_encrypted, is_link, created_at, updated_at)
        SELECT id || '_site', folder_id, 'Site', site, 0, 1, created_at, updated_at
        FROM files_old
        WHERE site IS NOT NULL AND site != '';
      `);

      // Migrate: encrypted_credentials → encrypted Password entry
      sqlite.execSync(`
        INSERT INTO files (id, folder_id, key, value, is_encrypted, is_link, created_at, updated_at)
        SELECT id || '_cred', folder_id, 'Password', encrypted_credentials, 1, 0, created_at, updated_at
        FROM files_old
        WHERE encrypted_credentials IS NOT NULL AND encrypted_credentials != '';
      `);

      // Migrate: username/encrypted_username → Username entry
      sqlite.execSync(`
        INSERT INTO files (id, folder_id, key, value, is_encrypted, is_link, created_at, updated_at)
        SELECT
          id || '_user',
          folder_id,
          'Username',
          CASE
            WHEN encrypted_username IS NOT NULL AND encrypted_username != ''
            THEN encrypted_username
            ELSE username
          END,
          CASE
            WHEN encrypted_username IS NOT NULL AND encrypted_username != ''
            THEN 1 ELSE 0
          END,
          0,
          created_at,
          updated_at
        FROM files_old
        WHERE (encrypted_username IS NOT NULL AND encrypted_username != '')
           OR (username IS NOT NULL AND username != '');
      `);

      sqlite.execSync("DROP TABLE files_old;");
    }
    // else: new schema already in place — nothing to do.

    sqlite.execSync("PRAGMA foreign_keys = ON;");
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
