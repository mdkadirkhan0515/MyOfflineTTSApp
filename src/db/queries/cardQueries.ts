/**
 * src/db/queries/cardQueries.ts
 * Card Queries - Dynamic Cards per Session
 * Table: cards
 */

import { getDB } from '../index';

export type CardRow = {
  id: string;
  session_id: string;
  content: string;
  card_order: number;
  created_at: number;
};

/**
 * Create new card
 */
export const createCard = (card: CardRow): void => {
  const db = getDB();
  db.execute(
    `INSERT INTO cards (id, session_id, content, card_order, created_at) VALUES (?, ?, ?, ?, ?);`,
    [card.id, card.session_id, card.content, card.card_order, card.created_at]
  );
};

/**
 * Get cards by session id - Ordered ASC for display
 */
export const getCardsBySessionId = (sessionId: string): CardRow[] => {
  const db = getDB();
  const result = db.execute(
    `SELECT * FROM cards WHERE session_id = ? ORDER BY card_order ASC;`,
    [sessionId]
  );
  return (result.rows?._array as CardRow[]) ?? [];
};

/**
 * Delete single card - Top-Left delete icon action
 */
export const deleteCard = (cardId: string): void => {
  const db = getDB();
  db.execute(`DELETE FROM cards WHERE id = ?;`, [cardId]);
};

/**
 * Delete all cards of a session - Used when session deleted
 */
export const deleteCardsBySessionId = (sessionId: string): void => {
  const db = getDB();
  db.execute(`DELETE FROM cards WHERE session_id = ?;`, [sessionId]);
};

/**
 * Get next card_order for a session
 */
export const getNextCardOrder = (sessionId: string): number => {
  const db = getDB();
  const result = db.execute(`SELECT MAX(card_order) as maxOrder FROM cards WHERE session_id = ?;`, [
    sessionId,
  ]);
  const row: any = result.rows?._array?.[0];
  const max = row?.maxOrder;
  return max !== null && max !== undefined ? max + 1 : 0;
};

/**
 * Get single card by id
 */
export const getCardById = (cardId: string): CardRow | null => {
  const db = getDB();
  const result = db.execute(`SELECT * FROM cards WHERE id = ? LIMIT 1;`, [cardId]);
  return (result.rows?._array?.[0] as CardRow) ?? null;
};

