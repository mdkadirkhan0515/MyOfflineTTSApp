/**
 * src/storage/mmkvKeys.ts
 * MMKV Keys - Only Required Keys (System Theme, No THEME_MODE)
 * Total 4 keys max as per requirement
 */

export const MMKV_KEYS = {
  ACTIVE_SESSION_ID: 'active_session_id',
  TTS_STATUS: 'tts_status', // { status: 'idle' | 'playing' | 'paused', currentCardId, charIndex }
  DB_SCHEMA_VERSION: 'db_schema_version',
  LAST_ACTIVE_DATE: 'last_active_date',
} as const;

export type MMKVKey = (typeof MMKV_KEYS)[keyof typeof MMKV_KEYS];

// Typed helpers
export type TTSStatus = {
  status: 'idle' | 'playing' | 'paused';
  currentCardId: string | null;
  charIndex: number;
};

