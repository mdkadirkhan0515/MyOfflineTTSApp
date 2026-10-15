/**
 * src/storage/mmkv.ts
 * MMKV Storage - Ultra Fast Synchronous State
 * Use for: Lightweight UI state, NOT heavy data
 * Heavy data -> SQLite
 */

import { createMMKV } from 'react-native-mmkv';

// Singleton MMKV Instance - Encrypted, Synchronous
export const storage = createMMKV({
  id: 'tts-app-storage',
  encryptionKey: 'tts-app-key', // Optional encryption
});

/**
 * MMKV Keys - Single Source of Truth
 * THEME_MODE removed - System theme follows Android directly
 */
export const MMKV_KEYS = {
  ACTIVE_SESSION_ID: 'ACTIVE_SESSION_ID',
  TTS_STATUS: 'TTS_STATUS',
  TTS_CURRENT_CARD_ID: 'TTS_CURRENT_CARD_ID',
  TTS_CHAR_INDEX: 'TTS_CHAR_INDEX',
} as const;

export type TTSStatus = 'IDLE' | 'PLAYING' | 'PAUSED';

/**
 * Typed Helpers - Clean API for any developer
 */

// Active Session
export const getActiveSessionId = (): string | null => {
  return storage.getString(MMKV_KEYS.ACTIVE_SESSION_ID) ?? null;
};

export const setActiveSessionId = (sessionId: string | null) => {
  if (sessionId === null) {
    storage.remove(MMKV_KEYS.ACTIVE_SESSION_ID);
  } else {
    storage.set(MMKV_KEYS.ACTIVE_SESSION_ID, sessionId);
  }
};

// TTS Status
export const getTTSStatus = (): TTSStatus => {
  return (
    (storage.getString(MMKV_KEYS.TTS_STATUS) as TTSStatus) ?? 'IDLE'
  );
};

export const setTTSStatus = (status: TTSStatus) => {
  storage.set(MMKV_KEYS.TTS_STATUS, status);
};

// TTS Current Card
export const getCurrentCardId = (): string | null => {
  return storage.getString(MMKV_KEYS.TTS_CURRENT_CARD_ID) ?? null;
};

export const setCurrentCardId = (cardId: string | null) => {
  if (cardId === null) {
    storage.remove(MMKV_KEYS.TTS_CURRENT_CARD_ID);
  } else {
    storage.set(MMKV_KEYS.TTS_CURRENT_CARD_ID, cardId);
  }
};

// TTS Char Index for Resume Logic
export const getTTSCharIndex = (): number => {
  return storage.getNumber(MMKV_KEYS.TTS_CHAR_INDEX) ?? 0;
};

export const setTTSCharIndex = (index: number) => {
  storage.set(MMKV_KEYS.TTS_CHAR_INDEX, index);
};

// Clear All (Logout / Reset)
export const clearStorage = () => {
  storage.clearAll();
};
