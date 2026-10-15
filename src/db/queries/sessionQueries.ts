/**
 * src/db/queries/sessionQueries.ts
 * Session Queries - High Performance JSI
 * Table: sessions
 */

import { getDB } from '../index';

export type SessionRow = {
  id: string;
  date_label: string; // Today, Yesterday, 8 Oct, 9 Oct
  session_name: string; // 9 Oct_i, 9 Oct_ii, 9 Oct_iii
  created_at: number;
};

/**
 * Create new session
 */
export const createSession = (session: SessionRow): void => {
  const db = getDB();
  db.execute(
    `INSERT INTO sessions (id, date_label, session_name, created_at) VALUES (?, ?, ?, ?);`,
    [session.id, session.date_label, session.session_name, session.created_at]
  );
};

/**
 * Get all sessions ordered by newest first
 */
export const getAllSessions = (): SessionRow[] => {
  const db = getDB();
  const result = db.execute(`SELECT * FROM sessions ORDER BY created_at DESC;`);
  return (result.rows?._array as SessionRow[]) ?? [];
};

/**
 * Get sessions filtered by date label
 */
export const getSessionsByDateLabel = (dateLabel: string): SessionRow[] => {
  const db = getDB();
  const result = db.execute(`SELECT * FROM sessions WHERE date_label = ? ORDER BY created_at ASC;`, [
    dateLabel,
  ]);
  return (result.rows?._array as SessionRow[]) ?? [];
};

/**
 * Count sessions for a date label - For auto naming (i, ii, iii)
 */
export const getSessionCountByDate = (dateLabel: string): number => {
  const db = getDB();
  const result = db.execute(`SELECT COUNT(*) as count FROM sessions WHERE date_label = ?;`, [
    dateLabel,
  ]);
  const row: any = result.rows?._array?.[0];
  return row?.count ?? 0;
};

/**
 * Delete session + cascade delete cards
 */
export const deleteSession = (sessionId: string): void => {
  const db = getDB();
  db.execute(`DELETE FROM sessions WHERE id = ?;`, [sessionId]);
};

/**
 * Get single session by id
 */
export const getSessionById = (sessionId: string): SessionRow | null => {
  const db = getDB();
  const result = db.execute(`SELECT * FROM sessions WHERE id = ? LIMIT 1;`, [sessionId]);
  return (result.rows?._array?.[0] as SessionRow) ?? null;
};

