/**
 * src/hooks/useCards.ts
 * Cards Hook - CRUD per Active Session
 * Final - Uses new query structure
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCardsBySessionId,
  createCard,
  deleteCard,
  getNextCardOrder,
} from '../db/queries/cardQueries';
import { Card } from '../types/card.types';

export const useCards = (sessionId: string | null) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCards = useCallback(() => {
    if (!sessionId) {
      setCards([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = getCardsBySessionId(sessionId);
      setCards(data);
    } catch (e) {
      console.log('[useCards] load error', e);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const addCard = useCallback(
    (content: string): Card | null => {
      if (!sessionId) return null;
      const order = getNextCardOrder(sessionId);
      const newCard: Card = {
        id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        session_id: sessionId,
        content,
        card_order: order,
        created_at: Date.now(),
      };
      createCard(newCard);
      setCards((prev) => [...prev, newCard]);
      return newCard;
    },
    [sessionId]
  );

  const removeCard = useCallback((cardId: string) => {
    deleteCard(cardId);
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);

  return { cards, isLoading, addCard, removeCard, reload: loadCards };
};

