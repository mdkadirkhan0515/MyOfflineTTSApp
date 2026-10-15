/**
 * src/db/client.ts
 * Database Client - op-sqlite (High Performance JSI)
 * Tables: sessions, cards
 * Responsibility: Singleton connection, schema creation, migrations
 */

import { open, type DB } from '@op-engineering/op-sqlite';

const DB_NAME = 'tts_cards.db';
const DB_VERSION = 1;

let dbInstance: DB | null = null;

/**
 * Get Singleton DB Instance
 * Synchronous & JSI powered - No lag
 */
export const getDB = (): DB => {
  if (dbInstance) {
    return dbInstance;
  }
  dbInstance = open({ name: DB_NAME });
  return dbInstance;
};

/**
 * Initialize Database Schema
 * Called once on App Startup from App.tsx
 */
export const initDatabase = () => {
  const db = getDB();

  // Enable Foreign Keys for relational integrity
  db.execute('PRAGMA foreign_keys = ON;');
  db.execute('PRAGMA journal_mode = WAL;');

  // Table 1: sessions (For Drawer Index - Date-wise history)
  // Example: 9 Oct_i, 9 Oct_ii
  db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      date_label TEXT NOT NULL,       -- Today, Yesterday, 8 Oct, 9 Oct
      session_name TEXT NOT NULL,     -- Auto-generated: 9 Oct_i, 9 Oct_ii
      created_at INTEGER NOT NULL     -- Timestamp for sorting
    );
  `);

  // Table 2: cards (Dynamic cards content)
  db.execute(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      content TEXT NOT NULL,          -- Main text from input
      card_order INTEGER NOT NULL,     -- Order inside session
      created_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );
  `);

  // Indexes for High Performance
  db.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_date_label ON sessions(date_label);`);
  db.execute(`CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);`);
  db.execute(`CREATE INDEX IF NOT EXISTS idx_cards_session_id ON cards(session_id);`);
  db.execute(`CREATE INDEX IF NOT EXISTS idx_cards_order ON cards(session_id, card_order ASC);`);

  console.log('[DB] Initialized - Version:', DB_VERSION);
};

/**
 * Close DB (Optional - for cleanup)
 */
export const closeDatabase = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

