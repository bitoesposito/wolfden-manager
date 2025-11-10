/**
 * Timer Service
 * Business logic for timer management
 * Separated from state logic to improve testability and reusability
 */

import dayjs from 'dayjs';
import type { TimerState } from '@/types';
import {
  getRemainingSeconds,
  calculateProgress,
  addMinutesToCurrentTime,
  addMinutesToTimestamp,
} from '@/lib/utils/time';

/**
 * Creates a new timer with specified duration
 */
export function createTimer(durationMinutes: number): TimerState {
  const start = addMinutesToCurrentTime(0);
  const end = addMinutesToCurrentTime(durationMinutes);

  return {
    startTime: start,
    endTime: end,
    initialDurationMinutes: durationMinutes,
    isActive: true,
  };
}

/**
 * Creates a timer with specific dates/times
 */
export function createTimerWithDates(startTime: string, endTime: string): TimerState {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const durationMinutes = end.diff(start, 'minute');

  return {
    startTime,
    endTime,
    initialDurationMinutes: durationMinutes,
    isActive: true,
  };
}

/**
 * Updates the dates/times of an existing timer
 */
export function updateTimerDates(
  timer: TimerState,
  startTime: string,
  endTime: string
): TimerState {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const durationMinutes = end.diff(start, 'minute');

  return {
    ...timer,
    startTime,
    endTime,
    initialDurationMinutes: durationMinutes,
  };
}

/**
 * Adds minutes to an existing timer
 */
export function addTimeToTimer(timer: TimerState, minutes: number): TimerState {
  if (!timer.isActive || !timer.endTime) {
    return timer;
  }

  const newEnd = addMinutesToTimestamp(timer.endTime, minutes);
  const newInitialDuration = timer.initialDurationMinutes + minutes;

  return {
    ...timer,
    endTime: newEnd,
    initialDurationMinutes: newInitialDuration,
  };
}

/**
 * Calculates a timer's progress
 */
export function calculateTimerProgress(timer: TimerState | undefined): number {
  if (!timer?.isActive || !timer.endTime) {
    return 0;
  }

  const remainingSeconds = getRemainingSeconds(timer.endTime, timer.startTime);
  return calculateProgress(timer.initialDurationMinutes, remainingSeconds);
}

/**
 * Updates progress of all cards with active timers
 */
export function updateCardsProgress<T extends { timer?: TimerState; progressValue: number }>(
  cards: T[]
): T[] {
  return cards.map((card) => {
    if (card.timer?.isActive && card.timer.endTime) {
      const progress = calculateTimerProgress(card.timer);
      return { ...card, progressValue: progress };
    }
    return card;
  });
}

