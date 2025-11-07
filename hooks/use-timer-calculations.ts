"use client"

import { useState, useEffect, useMemo } from 'react';
import type { TimerState } from '@/types';
import { getRemainingSeconds, calculateProgress, formatRemainingTime, isTimerExpired } from '@/lib/utils/time';

/**
 * Hook to calculate derived values from a timer state
 * Centralizes all calculation logic to avoid duplications
 * Updates frequently for smooth progress bar animation and real-time remaining time
 * @param timer - Timer state (can be undefined if not active)
 * @returns Calculated values: progress, remaining time, expiration status
 */
export function useTimerCalculations(timer: TimerState | undefined) {
  // Force re-calculation frequently by updating a timestamp
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  useEffect(() => {
    // Only set up interval if timer is active
    if (!timer?.isActive || !timer.endTime) {
      return;
    }

    // Update every 100ms for smooth animation
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, [timer?.isActive, timer?.endTime]);

  const calculations = useMemo(() => {
    // If timer is not active or doesn't exist, return default values
    if (!timer?.isActive || !timer.endTime) {
      return {
        progress: 0,
        remainingTime: '00:00',
        remainingSeconds: 0,
        isExpired: false,
      };
    }

    // Calculate remaining seconds using ISO timestamp
    // currentTimestamp dependency ensures recalculation every second
    const remainingSeconds = getRemainingSeconds(timer.endTime);
    
    // Calculate progress based on initial duration
    const progress = calculateProgress(timer.initialDurationMinutes, remainingSeconds);
    
    // Format remaining time for display
    const remainingTime = formatRemainingTime(remainingSeconds);
    
    // Check if timer is expired
    const isExpired = isTimerExpired(remainingSeconds);
    
    // Calculate remaining minutes for color determination
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    
    // Determine progress bar variant based on remaining time
    // Verde (default): > 30 minuti o 00:00 (timer non avviato)
    // Giallo (warning): <= 30 minuti
    // Arancio (orange): <= 20 minuti
    // Rosso (destructive): <= 10 minuti o scaduto (ma non 00:00)
    let progressVariant: "default" | "warning" | "orange" | "destructive" = "default";
    
    // Se è 00:00 (remainingSeconds === 0), usa sempre default
    if (remainingSeconds === 0) {
      progressVariant = "default";
    } else if (isExpired || remainingMinutes <= 10) {
      progressVariant = "destructive";
    } else if (remainingMinutes <= 20) {
      progressVariant = "orange";
    } else if (remainingMinutes <= 30) {
      progressVariant = "warning";
    }

    return {
      progress,
      remainingTime,
      remainingSeconds,
      isExpired,
      progressVariant,
    };
  }, [timer?.isActive, timer?.endTime, timer?.initialDurationMinutes, currentTimestamp]);

  return calculations;
}

