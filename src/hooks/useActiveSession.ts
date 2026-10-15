/**
 * src/hooks/useActiveSession.ts
 * Manages Active Session - Today/Yesterday/9 Oct Logic + Auto Naming (i, ii, iii)
 */

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage/mmkv';
import { MMKV_KEYS } from '../storage/mmkvKeys';
import {
  createSession,
  getSessionCountByDate,
} from '../db/queries/sessionQueries';
import {
  formatDateLabel,
  generateSessionName,
} from '../utils/dateFormatter';

export const useActiveSession = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedId =
      storage.getString(MMKV_KEYS.ACTIVE_SESSION_ID) || null;

    setActiveSessionId(savedId);
    setIsLoading(false);
  }, []);

  const setActiveSession = useCallback((sessionId: string) => {
    storage.set(MMKV_KEYS.ACTIVE_SESSION_ID, sessionId);
    setActiveSessionId(sessionId);
  }, []);

  const createNewSession = useCallback((): string => {
    const dateLabel = formatDateLabel(new Date());
    const count = getSessionCountByDate(dateLabel);
    const sessionName = generateSessionName(dateLabel, count);

    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      date_label: dateLabel,
      session_name: sessionName,
      created_at: Date.now(),
    };

    createSession(newSession);
    setActiveSession(newSession.id);

    return newSession.id;
  }, [setActiveSession]);

  const switchSession = useCallback(
    (sessionId: string) => {
      setActiveSession(sessionId);
    },
    [setActiveSession],
  );

  const clearActiveSession = useCallback(() => {
    storage.remove(MMKV_KEYS.ACTIVE_SESSION_ID);
    setActiveSessionId(null);
  }, []);

  return {
    activeSessionId,
    isLoading,
    createNewSession,
    switchSession,
    clearActiveSession,
    setActiveSession,
  };
};
