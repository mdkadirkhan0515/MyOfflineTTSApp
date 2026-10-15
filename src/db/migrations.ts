/**
 * src/db/migrations.ts
 * Database Migrations - Version Control
 * Future updates safe
 */

import { getDB } from './index';
import { ALL_TABLES, CREATE_INDEXES, SCHEMA_VERSION } from './schema';
import { storage } from '../storage/mmkv';

const DB_VERSION_KEY = 'db_schema_version';

export const getCurrentDBVersion = (): number => {
  return storage.getNumber(DB_VERSION_KEY) ?? 0;
};

export const setDBVersion = (version: number): void => {
  storage.set(DB_VERSION_KEY, version);
};

/**
 * Run migrations if needed
 */
export const runMigrations = (): void => {
  const currentVersion = getCurrentDBVersion();

  if (currentVersion >= SCHEMA_VERSION) {
    console.log(`[DB] Already at version ${currentVersion}`);
    return;
  }

  const db = getDB();

  console.log(
    `[DB] Migrating from ${currentVersion} to ${SCHEMA_VERSION}`,
  );

  // Migration v0 -> v1: Initial creation
  if (currentVersion < 1) {
    db.execute(`PRAGMA foreign_keys = ON;`);

    // Create tables
    ALL_TABLES.forEach((sql) => {
      db.execute(sql);
    });

    // Create indexes
    CREATE_INDEXES.forEach((sql) => {
      db.execute(sql);
    });

    console.log(
      '[DB] Migration v1 completed - Tables + Indexes created',
    );
  }

  // Future migrations example:
  // if (currentVersion < 2) {
  //   db.execute(`ALTER TABLE cards ADD COLUMN is_favorite INTEGER DEFAULT 0;`);
  // }

  setDBVersion(SCHEMA_VERSION);

  console.log(`[DB] Now at version ${SCHEMA_VERSION}`);
};

/**
 * For dev - Reset DB (dangerous)
 */
export const resetDatabase = (): void => {
  const db = getDB();

  db.execute(`DROP TABLE IF EXISTS cards;`);
  db.execute(`DROP TABLE IF EXISTS sessions;`);

  storage.remove(DB_VERSION_KEY);

  console.log('[DB] Reset complete');

  runMigrations();
};
