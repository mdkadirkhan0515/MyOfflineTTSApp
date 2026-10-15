/**
 * src/types/session.types.ts
 * Session Types - Strict Typed
 */

export type DateLabel = string; // 'Today' | 'Yesterday' | '8 Oct' | '9 Oct' | '10 Oct'

export interface Session {
  id: string;
  date_label: DateLabel;
  session_name: string; // Format: '9 Oct_i', '9 Oct_ii', '9 Oct_iii'
  created_at: number; // timestamp ms
}

export interface SessionGroup {
  date_label: DateLabel;
  sessions: Session[];
}

export type CreateSessionPayload = Omit<Session, 'id' | 'created_at'> & {
  id?: string;
  created_at?: number;
};

export const ROMAN_NUMERALS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'] as const;

export const DATE_FILTERS = ['All', 'Today', 'Yesterday', '8 Oct', '9 Oct', '10 Oct'] as const;
export type DateFilter = (typeof DATE_FILTERS)[number];

