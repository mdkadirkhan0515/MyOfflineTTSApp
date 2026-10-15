/**
 * src/db/schema.ts
 * Database Schema - Sessions & Cards
 * Engine: op-sqlite JSI (No Promise, Sync)
 */

export const SCHEMA_VERSION = 1;

export const CREATE_SESSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    date_label TEXT NOT NULL,
    session_name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`;

export const CREATE_CARDS_TABLE = `
  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    content TEXT NOT NULL,
    card_order INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );
`;

export const CREATE_INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_sessions_date_label ON sessions(date_label);`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_cards_session_id ON cards(session_id);`,
  `CREATE INDEX IF NOT EXISTS idx_cards_order ON cards(session_id, card_order);`,
];

export const ALL_TABLES = [CREATE_SESSIONS_TABLE, CREATE_CARDS_TABLE];

