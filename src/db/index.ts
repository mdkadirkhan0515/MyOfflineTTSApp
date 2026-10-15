/**
 * src/db/index.ts
 * Database Entry - Singleton op-sqlite JSI Connection
 * High Performance, No Promise Wrapper
 */

import { open } from '@op-engineering/op-sqlite';

let dbInstance: any = null;

/**
 * Get singleton DB instance
 */
export const getDB = () => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = open({
    name: 'tts_app.db',
    location: 'default',
  });

  // Enable foreign keys for CASCADE
  dbInstance.execute(`PRAGMA foreign_keys = ON;`);

  return dbInstance;
};

/**
 * Init DB - Called once in App.tsx
 */
export const initDatabase = (): void => {
  const db = getDB();

  // Import here to avoid circular
  const { runMigrations } = require('./migrations');
  runMigrations();

  console.log('[DB] Initialized - tts_app.db');
};

/**
 * Close DB - For cleanup
 */
export const closeDatabase = (): void => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('[DB] Closed');
  }
};

