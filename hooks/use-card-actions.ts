/**
 * Hook for actions on a specific card
 * Provides pre-configured functions for a card/section
 */

import { useCallback } from 'react';
import { useAppStore } from '@/store/app-store';

/**
 * Hook that returns pre-configured actions for a specific card
 * Avoids having to pass sectionId and cardId every time
 */
export function useCardActions(sectionId: number, cardId: number) {
  const store = useAppStore();

  const updateCardName = useCallback(
    (name: string) => {
      store.updateCardName(sectionId, cardId, name);
    },
    [store, sectionId, cardId]
  );

  const deleteCard = useCallback(() => {
    store.deleteCard(sectionId, cardId);
  }, [store, sectionId, cardId]);

  const startTimer = useCallback(
    (durationMinutes: number) => {
      store.startTimer(sectionId, cardId, durationMinutes);
    },
    [store, sectionId, cardId]
  );

  const startTimerWithDates = useCallback(
    (startTime: string, endTime: string) => {
      store.startTimerWithDates(sectionId, cardId, startTime, endTime);
    },
    [store, sectionId, cardId]
  );

  const updateTimerDates = useCallback(
    (startTime: string, endTime: string) => {
      store.updateTimerDates(sectionId, cardId, startTime, endTime);
    },
    [store, sectionId, cardId]
  );

  const addTimeToTimer = useCallback(
    (minutes: number) => {
      store.addTimeToTimer(sectionId, cardId, minutes);
    },
    [store, sectionId, cardId]
  );

  const clearTimer = useCallback(() => {
    store.clearTimer(sectionId, cardId);
  }, [store, sectionId, cardId]);

  return {
    updateCardName,
    deleteCard,
    startTimer,
    startTimerWithDates,
    updateTimerDates,
    addTimeToTimer,
    clearTimer,
  };
}

