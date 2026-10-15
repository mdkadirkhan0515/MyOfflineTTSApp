/**
 * src/services/ttsService.ts
 * Google Offline TTS Service - High Performance Control
 * Engine: com.google.android.tts (Offline)
 * Features: Queue Management, Pause/Resume via Char Index, Event Listeners
 */

import Tts from 'react-native-tts';
import {
  setTTSStatus,
  setCurrentCardId,
  setTTSCharIndex,
  getTTSCharIndex,
  getCurrentCardId,
} from '../storage/mmkv';

// --- Types ---
export type TTSCallbacks = {
  onStart?: (cardId: string) => void;
  onProgress?: (cardId: string, charIndex: number) => void; // For Karaoke Yellow Glow
  onFinish?: (cardId: string) => void;
  onCancel?: () => void;
};

let callbacks: TTSCallbacks = {};
let isInitialized = false;

/**
 * Initialize TTS Engine - Call on App Start
 */
export const initTTS = async () => {
  if (isInitialized) return;

  // 1. Force Google Offline Engine
  try {
    await Tts.setDefaultEngine('com.google.android.tts');
  } catch {
    console.warn('[TTS] Google TTS Engine not found, using default');
  }

  // 2. Default Language - Auto detection will be handled per speak()
  await Tts.setDefaultLanguage('en-US');
  await Tts.setDefaultRate(0.5);
  await Tts.setDefaultPitch(1.0);

  // 3. Event Listeners - Sync with UI
  Tts.addEventListener('tts-start', (event: any) => {
    setTTSStatus('PLAYING');
    const cardId = getCurrentCardId();
    if (cardId && callbacks.onStart) {
      callbacks.onStart(cardId);
    }
  });

  Tts.addEventListener('tts-progress', (event: any) => {
    // event.charIndex for karaoke highlighting
    const charIndex = (event as any).charIndex ?? 0;
    setTTSCharIndex(charIndex);
    const cardId = getCurrentCardId();
    if (cardId && callbacks.onProgress) {
      callbacks.onProgress(cardId, charIndex);
    }
  });

  Tts.addEventListener('tts-finish', (event: any) => {
    setTTSStatus('IDLE');
    setTTSCharIndex(0);
    const cardId = getCurrentCardId();
    if (cardId && callbacks.onFinish) {
      callbacks.onFinish(cardId);
    }
    // Auto-dismiss floating controller will be handled via status IDLE
    setCurrentCardId(null);
  });

  Tts.addEventListener('tts-cancel', () => {
    setTTSStatus('IDLE');
    if (callbacks.onCancel) callbacks.onCancel();
  });

  isInitialized = true;
  console.log('[TTS] Initialized - Google Offline Engine');
};

/**
 * Set Callbacks from UI Hooks (useTTS)
 */
export const setTTSCallbacks = (newCallbacks: TTSCallbacks) => {
  callbacks = newCallbacks;
};

/**
 * Speak - Single Card Text
 * Queue Management: Always stop previous before new
 */
export const speak = async (cardId: string, fullText: string, language?: string) => {
  // 1. Stop any running TTS instantly - Prevents overlap
  await Tts.stop();

  // 2. Set active card
  setCurrentCardId(cardId);
  setTTSCharIndex(0);
  setTTSStatus('PLAYING');

  // 3. Dynamic Language (Optional auto-detect)
  if (language) {
    await Tts.setDefaultLanguage(language);
  }

  // 4. Speak full text
  Tts.speak(fullText);
};

/**
 * Pause - Using Stop + Save Index Trick (Works on all Android devices)
 * Direct Tts.pause() is not reliable on many devices
 */
export const pause = async () => {
  const currentIndex = getTTSCharIndex();
  await Tts.stop(); // Stop but keep index saved
  setTTSStatus('PAUSED');
  console.log('[TTS] Paused at index:', currentIndex);
};

/**
 * Resume - Speak remaining text from saved index
 */
export const resume = async (fullText: string) => {
  const savedIndex = getTTSCharIndex();
  const remainingText = fullText.substring(savedIndex);

  if (remainingText.trim().length === 0) {
    // Already finished
    setTTSStatus('IDLE');
    setTTSCharIndex(0);
    return;
  }

  setTTSStatus('PLAYING');
  Tts.speak(remainingText);
};

/**
 * Stop Completely - For new card click or finish
 */
export const stop = async () => {
  await Tts.stop();
  setTTSStatus('IDLE');
  setTTSCharIndex(0);
  setCurrentCardId(null);
};

/**
 * Check if any speech is active
 */
export const isSpeaking = async (): Promise<boolean> => {
  const status = getTTSCharIndex(); // We rely on MMKV status
  // react-native-tts doesn't have reliable isSpeaking on Android, use MMKV
  return false; // Will be determined via MMKV status in hook
};

