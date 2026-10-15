/**
 * src/hooks/useTTS.ts
 * TTS Hook - Floating Controller + Yellow Highlight Logic
 * Engine: react-native-tts + MMKV persistence
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import Tts from 'react-native-tts';
import { storage } from '../storage/mmkv';
import { MMKV_KEYS } from '../storage/mmkvKeys';
import { Card } from '../types/card.types';

type TTSStatus = 'idle' | 'playing' | 'paused';

export const useTTS = () => {
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [status, setStatus] = useState<TTSStatus>('idle');
  const [charIndex, setCharIndex] = useState(0);
  const [showController, setShowController] = useState(false);
  const [currentText, setCurrentText] = useState('');

  const fullTextRef = useRef('');
  const currentCardRef = useRef<Card | null>(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const saved = storage.getString(MMKV_KEYS.TTS_STATUS);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setStatus(parsed.status ?? 'idle');
        setCurrentCardId(parsed.currentCardId ?? null);
        setCharIndex(parsed.charIndex ?? 0);
        charIndexRef.current = parsed.charIndex ?? 0;
      } catch {}
    }

    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);

    const finishListener = Tts.addEventListener(
      'tts-finish',
      () => {
        setStatus('idle');
        setShowController(false);
        setCurrentCardId(null);
        setCharIndex(0);
        charIndexRef.current = 0;
        fullTextRef.current = '';

        storage.remove(MMKV_KEYS.TTS_STATUS);
      },
    );

    const cancelListener = Tts.addEventListener(
      'tts-cancel',
      () => {
        setStatus('idle');
      },
    );

    return () => {
      try {
        (finishListener as any)?.remove?.();
      } catch {}

      try {
        (cancelListener as any)?.remove?.();
      } catch {}

      try {
        (Tts as any).removeEventListener?.('tts-finish', () => {});
      } catch {}

      try {
        (Tts as any).removeEventListener?.('tts-cancel', () => {});
      } catch {}

      Tts.stop();
    };
  }, []);

  const persistStatus = useCallback(
    (s: TTSStatus, cardId: string | null, idx: number) => {
      storage.set(
        MMKV_KEYS.TTS_STATUS,
        JSON.stringify({
          status: s,
          currentCardId: cardId,
          charIndex: idx,
        }),
      );
    },
    [],
  );

  const speakCard = useCallback(
    (card: Card) => {
      Tts.stop();

      const text = card.content;

      fullTextRef.current = text;
      currentCardRef.current = card;
      charIndexRef.current = 0;

      setCurrentText(text);
      setCurrentCardId(card.id);
      setCharIndex(0);
      setStatus('playing');
      setShowController(true);

      persistStatus('playing', card.id, 0);

      const interval = setInterval(() => {
        if (charIndexRef.current >= text.length) {
          clearInterval(interval);
          return;
        }

        const nextSpace = text.indexOf(' ', charIndexRef.current);

        const jump =
          nextSpace === -1
            ? 5
            : nextSpace - charIndexRef.current + 1;

        charIndexRef.current += jump > 0 ? jump : 1;

        setCharIndex(charIndexRef.current);
      }, 350);

      (Tts as any)._highlightInterval = interval;

      Tts.speak(text);
    },
    [persistStatus],
  );

  const pause = useCallback(() => {
    Tts.pause?.();

    if (!(Tts as any).pause) {
      Tts.stop();
    }

    setStatus('paused');

    persistStatus(
      'paused',
      currentCardId,
      charIndexRef.current,
    );

    if ((Tts as any)._highlightInterval) {
      clearInterval((Tts as any)._highlightInterval);
    }
  }, [currentCardId, persistStatus]);

  const resume = useCallback(() => {
    if (!fullTextRef.current) {
      return;
    }

    const remaining = fullTextRef.current.slice(
      charIndexRef.current,
    );

    if (remaining.trim().length === 0) {
      setStatus('idle');
      setShowController(false);
      return;
    }

    setStatus('playing');

    persistStatus(
      'playing',
      currentCardId,
      charIndexRef.current,
    );

    Tts.speak(remaining);
  }, [currentCardId, persistStatus]);

  const stop = useCallback(() => {
    Tts.stop();

    if ((Tts as any)._highlightInterval) {
      clearInterval((Tts as any)._highlightInterval);
    }

    setStatus('idle');
    setShowController(false);
    setCurrentCardId(null);
    setCharIndex(0);

    charIndexRef.current = 0;
    fullTextRef.current = '';

    setCurrentText('');

    storage.remove(MMKV_KEYS.TTS_STATUS);
  }, []);

  const replay = useCallback(() => {
    if (!currentCardRef.current) {
      return;
    }

    speakCard(currentCardRef.current);
  }, [speakCard]);

  return {
    currentCardId,
    status,
    charIndex,
    currentText,
    showController,
    speakCard,
    pause,
    resume,
    stop,
    replay,
    isPlaying: status === 'playing',
    isPaused: status === 'paused',
  };
};
