"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import type { TimerState } from '@/types';
import { 
  getRemainingSeconds, 
  calculateProgress, 
  formatRemainingTime, 
  isTimerExpired,
  calculateProgressVariant
} from '@/lib/utils/time';
import { playTimerExpiredSound } from '@/lib/utils/sound';

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
  const previousExpiredRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Initialize previousExpiredRef based on initial timer state
  // If timer is already expired on mount, don't play sound
  useEffect(() => {
    if (!hasInitializedRef.current && timer?.isActive && timer.endTime) {
      const remainingSeconds = getRemainingSeconds(timer.endTime, timer.startTime);
      const isExpired = isTimerExpired(remainingSeconds);
      // Mark as handled if already expired to avoid sound on reload
      previousExpiredRef.current = isExpired;
      hasInitializedRef.current = true;
    } else if (!timer?.isActive) {
      hasInitializedRef.current = false;
    }
  }, [timer?.isActive, timer?.endTime, timer?.startTime]);

  useEffect(() => {
    // Only set up interval if timer is active
    if (!timer?.isActive || !timer.endTime) {
      previousExpiredRef.current = false;
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

    const remainingSeconds = getRemainingSeconds(timer.endTime, timer.startTime);
    
    // Calculate progress based on initial duration
    const progress = calculateProgress(timer.initialDurationMinutes, remainingSeconds);
    
    // Format remaining time for display
    const remainingTime = formatRemainingTime(remainingSeconds);
    
    // Check if timer is expired
    const isExpired = isTimerExpired(remainingSeconds);
    
    // Determine progress bar variant based on remaining time
    const progressVariant = calculateProgressVariant(remainingSeconds);

    return {
      progress,
      remainingTime,
      remainingSeconds,
      isExpired,
      progressVariant,
    };
  }, [timer?.isActive, timer?.endTime, timer?.initialDurationMinutes, currentTimestamp]);

  // Play sound when timer expires (transition from not expired to expired)
  useEffect(() => {
    const isExpired = calculations.isExpired;
    
    if (isExpired && !previousExpiredRef.current) {
      // Timer just expired: play sound
      playTimerExpiredSound();
      previousExpiredRef.current = true;
    } else if (!isExpired) {
      // Reset when timer is no longer expired
      previousExpiredRef.current = false;
    }
  }, [calculations.isExpired]);

  return calculations;
}

