/**
 * src/db/queries/index.ts
 * Central export for all queries - final aggregator
 * This ensures useActiveSession, useCards work without import errors
 */

export * from './sessionQueries';
export * from './cardQueries';

import { getDB } from '../index';
import { Session } from '../../types/session.types';
import { Card } from '../../types/card.types';

// Legacy wrappers for old imports (if any file uses old names)
export const getCardsBySession = (sessionId: string): Card[] => {
  const db = getDB();
  const result = db.execute(`SELECT * FROM cards WHERE session_id = ? ORDER BY card_order ASC`, [sessionId]);
  const rows = result.rows?._array ?? result.rows ?? [];
  return rows as Card[];
};

export const getAllSessions = (): Session[] => {
  const db = getDB();
  const result = db.execute(`SELECT * FROM sessions ORDER BY created_at DESC`);
  const rows = result.rows?._array ?? result.rows ?? [];
  return rows as Session[];
};

