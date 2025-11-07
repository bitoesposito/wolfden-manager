"use client"

import { useState, useCallback, useEffect } from 'react';
import type { UserCard, TimerState } from '@/types';
import { generateNextId } from '@/lib/utils/id';
import { getRemainingSeconds, calculateProgress, addMinutesToCurrentTime, addMinutesToTimestamp } from '@/lib/utils/time';
import dayjs from 'dayjs';

const INITIAL_CARDS: UserCard[] = [{ id: 1, name: '1', progressValue: 0 }];

/**
 * Hook to manage user cards with timers
 * Centralizes state management for cards and their timers
 * Uses utility functions for all time calculations
 */
export function useUserCards() {
  const [cards, setCards] = useState<UserCard[]>(INITIAL_CARDS);

  /**
   * Recalculates progress for all active timers frequently for smooth animation
   * Uses ISO timestamps for precise calculations based on real dates
   * Updates every 100ms for fluid progress bar animation
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) =>
        prev.map((card) => {
          if (card.timer?.isActive && card.timer.endTime) {
            // Calculate remaining seconds using ISO timestamp
            const remainingSeconds = getRemainingSeconds(card.timer.endTime);
            // Calculate progress based on initial duration
            const progress = calculateProgress(card.timer.initialDurationMinutes, remainingSeconds);
            return { ...card, progressValue: progress };
          }
          return card;
        })
      );
    }, 1000); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  /**
   * Adds a new card to the list
   */
  const addCard = useCallback(() => {
    setCards((prev) => {
      const newId = generateNextId(prev.map((c) => c.id));
      return [...prev, { id: newId, name: String(newId), progressValue: 0 }];
    });
  }, []);

  /**
   * Deletes a card from the list
   * @param id - ID of the card to delete
   */
  const deleteCard = useCallback((id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  /**
   * Updates the name of a card
   * @param id - ID of the card
   * @param name - New name for the card
   */
  const updateCardName = useCallback((id: number, name: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, name } : card))
    );
  }, []);

  /**
   * Starts the timer for a specific card
   * Creates complete ISO timestamps to properly handle dates and times
   * @param id - ID of the card
   * @param durationMinutes - Timer duration in minutes
   */
  const startTimer = useCallback((id: number, durationMinutes: number) => {
    // Create ISO timestamps for timer start and end
    const start = addMinutesToCurrentTime(0);
    const end = addMinutesToCurrentTime(durationMinutes);

    const timer: TimerState = {
      startTime: start,
      endTime: end,
      initialDurationMinutes: durationMinutes,
      isActive: true,
    };

    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          // Calculate initial progress (will be 100% at start)
          const remainingSeconds = getRemainingSeconds(end);
          const progress = calculateProgress(durationMinutes, remainingSeconds);
          return { ...card, timer, progressValue: progress };
        }
        return card;
      })
    );
  }, []);

  /**
   * Starts the timer for a specific card with custom start and end times
   * @param id - ID of the card
   * @param startTime - ISO timestamp for start
   * @param endTime - ISO timestamp for end
   */
  const startTimerWithDates = useCallback((id: number, startTime: string, endTime: string) => {
    // Calculate duration in minutes from the timestamps
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const durationMinutes = end.diff(start, 'minute');

    const timer: TimerState = {
      startTime,
      endTime,
      initialDurationMinutes: durationMinutes,
      isActive: true,
    };

    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          // Calculate initial progress
          const remainingSeconds = getRemainingSeconds(endTime);
          const progress = calculateProgress(durationMinutes, remainingSeconds);
          return { ...card, timer, progressValue: progress };
        }
        return card;
      })
    );
  }, []);

  /**
   * Adds minutes to an active card's timer
   * If minutes is negative, subtracts time (can lead to expired timer)
   * @param id - ID of the card
   * @param minutes - Minutes to add (can be negative)
   */
  const addTimeToTimer = useCallback((id: number, minutes: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id && card.timer?.isActive && card.timer.endTime) {
          // Add/subtract minutes to existing ISO timestamp
          const newEnd = addMinutesToTimestamp(card.timer.endTime, minutes);
          const newInitialDuration = card.timer.initialDurationMinutes + minutes;

          const updatedTimer: TimerState = {
            ...card.timer,
            endTime: newEnd,
            initialDurationMinutes: newInitialDuration,
          };

          // Recalculate progress immediately
          const remainingSeconds = getRemainingSeconds(newEnd);
          const progress = calculateProgress(newInitialDuration, remainingSeconds);

          return { ...card, timer: updatedTimer, progressValue: progress };
        }
        return card;
      })
    );
  }, []);

  /**
   * Updates the timer dates for an active card
   * @param id - ID of the card
   * @param startTime - New ISO timestamp for start
   * @param endTime - New ISO timestamp for end
   */
  const updateTimerDates = useCallback((id: number, startTime: string, endTime: string) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id && card.timer?.isActive) {
          // Calculate new duration in minutes
          const start = dayjs(startTime);
          const end = dayjs(endTime);
          const durationMinutes = end.diff(start, 'minute');

          const updatedTimer: TimerState = {
            ...card.timer,
            startTime,
            endTime,
            initialDurationMinutes: durationMinutes,
          };

          // Recalculate progress immediately
          const remainingSeconds = getRemainingSeconds(endTime);
          const progress = calculateProgress(durationMinutes, remainingSeconds);

          return { ...card, timer: updatedTimer, progressValue: progress };
        }
        return card;
      })
    );
  }, []);

  /**
   * Resets the timer for a card
   * @param id - ID of the card
   */
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
    startTimerWithDates,
    updateTimerDates,
    addTimeToTimer,
    clearTimer,
  };
}

