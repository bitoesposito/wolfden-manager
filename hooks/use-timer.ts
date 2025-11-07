"use client"

import { useState, useEffect, useCallback } from 'react';
import { getCurrentTimeString, addMinutesToTime, getRemainingMinutes, calculateProgress } from '@/lib/utils/time';

export interface TimerState {
  startTime: string | null;
  endTime: string | null;
  initialDurationMinutes: number;
  isActive: boolean;
}

const DEFAULT_DURATION_MINUTES = 60; // 1 ora di default

export function useTimer(cardId: number) {
  const [timerState, setTimerState] = useState<TimerState>({
    startTime: null,
    endTime: null,
    initialDurationMinutes: DEFAULT_DURATION_MINUTES,
    isActive: false,
  });

  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [progress, setProgress] = useState(0);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate remaining time and progress when timer is active
  useEffect(() => {
    if (timerState.isActive && timerState.endTime) {
      const remaining = getRemainingMinutes(timerState.endTime);
      setRemainingMinutes(remaining);
      
      const progressValue = calculateProgress(timerState.initialDurationMinutes, remaining);
      setProgress(progressValue);
    } else {
      setRemainingMinutes(0);
      setProgress(0);
    }
  }, [currentTime, timerState.isActive, timerState.endTime, timerState.initialDurationMinutes]);

  const startTimer = useCallback((durationMinutes: number = DEFAULT_DURATION_MINUTES) => {
    const start = getCurrentTimeString();
    const end = addMinutesToTime(start, durationMinutes);
    
    setTimerState({
      startTime: start,
      endTime: end,
      initialDurationMinutes: durationMinutes,
      isActive: true,
    });
  }, []);

  const addTime = useCallback((minutes: number) => {
    if (!timerState.isActive || !timerState.endTime) return;
    
    const newEndTime = addMinutesToTime(timerState.endTime, minutes);
    const newInitialDuration = timerState.initialDurationMinutes + minutes;
    
    setTimerState((prev) => ({
      ...prev,
      endTime: newEndTime,
      initialDurationMinutes: newInitialDuration,
    }));
  }, [timerState.isActive, timerState.endTime, timerState.initialDurationMinutes]);

  const clearTimer = useCallback(() => {
    setTimerState({
      startTime: null,
      endTime: null,
      initialDurationMinutes: DEFAULT_DURATION_MINUTES,
      isActive: false,
    });
    setRemainingMinutes(0);
    setProgress(0);
  }, []);

  return {
    startTime: timerState.startTime,
    endTime: timerState.endTime,
    isActive: timerState.isActive,
    currentTime,
    remainingMinutes,
    progress,
    startTimer,
    addTime,
    clearTimer,
  };
}