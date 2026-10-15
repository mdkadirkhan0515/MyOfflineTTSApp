/**
 * src/types/card.types.ts
 * Card Types - Dynamic Height & TTS Tracking
 */

export interface Card {
  id: string;
  session_id: string;
  content: string;
  card_order: number;
  created_at: number;
}

export interface CardUIState {
  isPlaying: boolean;
  isCurrentCard: boolean;
  highlightedCharIndex: number; // Yellow glow position
}

export interface CreateCardPayload {
  session_id: string;
  content: string;
  card_order?: number;
}

export type CardAction = 'delete' | 'copy' | 'sound';

export interface TTSState {
  currentCardId: string | null;
  isPlaying: boolean;
  charIndex: number;
  showController: boolean;
  fullText: string;
}

