"use client"

import { useState, useCallback, useEffect } from 'react';
import type { UserCard, TimerState } from '@/types';
import { generateNextId } from '@/lib/utils/id';
import { getCurrentTimeString, getRemainingMinutes, calculateProgress, addMinutesToTime } from '@/lib/utils/time';

const INITIAL_CARDS: UserCard[] = [{ id: 1, name: '1', progressValue: 0 }];

export function useUserCards() {
  const [cards, setCards] = useState<UserCard[]>(INITIAL_CARDS);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());

  // Update current time every second to recalculate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Recalculate progress for all active timers
  useEffect(() => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.timer?.isActive && card.timer.endTime) {
          const remaining = getRemainingMinutes(card.timer.endTime);
          const progress = calculateProgress(card.timer.initialDurationMinutes, remaining);
          return { ...card, progressValue: progress };
        }
        return card;
      })
    );
  }, [currentTime]);

  const addCard = useCallback(() => {
    setCards((prev) => {
      const newId = generateNextId(prev.map((c) => c.id));
      return [...prev, { id: newId, name: String(newId), progressValue: 0 }];
    });
  }, []);

  const deleteCard = useCallback((id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const updateCardName = useCallback((id: number, name: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, name } : card))
    );
  }, []);

  const startTimer = useCallback((id: number, durationMinutes: number) => {
    const start = getCurrentTimeString();
    const end = addMinutesToTime(start, durationMinutes);

    const timer: TimerState = {
      startTime: start,
      endTime: end,
      initialDurationMinutes: durationMinutes,
      isActive: true,
    };

    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          const remaining = getRemainingMinutes(end);
          const progress = calculateProgress(durationMinutes, remaining);
          return { ...card, timer, progressValue: progress };
        }
        return card;
      })
    );
  }, []);

  const addTimeToTimer = useCallback((id: number, minutes: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id && card.timer?.isActive && card.timer.endTime) {
          const newEnd = addMinutesToTime(card.timer.endTime, minutes);
          const newInitialDuration = card.timer.initialDurationMinutes + minutes;

          const updatedTimer: TimerState = {
            ...card.timer,
            endTime: newEnd,
            initialDurationMinutes: newInitialDuration,
          };

          // Recalculate progress immediately after adding time
          const remaining = getRemainingMinutes(newEnd);
          const progress = calculateProgress(newInitialDuration, remaining);

          return { ...card, timer: updatedTimer, progressValue: progress };
        }
        return card;
      })
    );
  }, []);

  const clearTimer = useCallback((id: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, timer: undefined, progressValue: 0 }
          : card
      )
    );
  }, []);

  return {
    cards,
    addCard,
    deleteCard,
    updateCardName,
    startTimer,
    addTimeToTimer,
    clearTimer,
  };
}

