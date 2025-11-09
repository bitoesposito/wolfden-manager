/**
 * Hook to manage time inputs for timer start/end times
 * Handles state management and conversion between time strings and ISO timestamps
 */

import { useState, useEffect, useCallback } from 'react';
import { timestampToTimeString, timeStringToISO } from '@/lib/utils/time';
import type { TimerState } from '@/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface UseTimeInputsProps {
  timer?: TimerState;
  onTimeChange?: (startTime: string, endTime: string) => void;
  mounted: boolean;
}

/**
 * Hook that manages time input state and handles conversions
 * @param timer - Current timer state
 * @param onTimeChange - Callback when times change
 * @param mounted - Whether component is mounted (to prevent hydration mismatch)
 * @returns Time input values and change handlers
 */
export function useTimeInputs({ timer, onTimeChange, mounted }: UseTimeInputsProps) {
  const [startTimeValue, setStartTimeValue] = useState('00:00');
  const [endTimeValue, setEndTimeValue] = useState('00:00');

  // Convert ISO timestamp to HH:mm for display
  const startTime = mounted ? timestampToTimeString(timer?.startTime ?? null) : '00:00';
  const endTime = mounted ? timestampToTimeString(timer?.endTime ?? null) : '00:00';

  // Update local state when timer changes
  useEffect(() => {
    if (mounted) {
      setStartTimeValue(startTime);
      setEndTimeValue(endTime);
    }
  }, [startTime, endTime, mounted]);

  const handleStartTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTimeValue(newTime);
    
    if (onTimeChange && newTime) {
      // Keep date from existing timer, change only time; otherwise use current date
      const newStartISO = timeStringToISO(newTime, timer?.startTime);
      
      // For end time, use timer date if exists, otherwise current date
      const endBaseDate = timer?.endTime || timer?.startTime;
      const endISO = timeStringToISO(endTimeValue, endBaseDate);
      
      if (newStartISO && endISO) {
        onTimeChange(newStartISO, endISO);
      }
    }
  }, [onTimeChange, endTimeValue, timer]);

  const handleEndTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTimeValue(newTime);
    
    if (onTimeChange && newTime) {
      let startISO: string;
      
      if (timer?.startTime) {
        // Existing timer: keep existing start time
        startISO = timeStringToISO(startTimeValue, timer.startTime);
      } else {
        // No timer: set start time to current time when entering end time
        const currentTime = dayjs().tz('Europe/Rome').format('HH:mm');
        setStartTimeValue(currentTime);
        startISO = timeStringToISO(currentTime, null);
      }
      
      // For end time, use timer date if exists, otherwise current date
      const endBaseDate = timer?.endTime || timer?.startTime;
      const newEndISO = timeStringToISO(newTime, endBaseDate);
      
      if (startISO && newEndISO) {
        onTimeChange(startISO, newEndISO);
      }
    }
  }, [onTimeChange, startTimeValue, timer]);

  return {
    startTime,
    endTime,
    startTimeValue,
    endTimeValue,
    handleStartTimeChange,
    handleEndTimeChange,
  };
}

