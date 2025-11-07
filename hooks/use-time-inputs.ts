/**
 * Hook to manage time inputs for timer start/end times
 * Handles state management and conversion between time strings and ISO timestamps
 */

import { useState, useEffect, useCallback } from 'react';
import { timestampToTimeString, timeStringToISO } from '@/lib/utils/time';
import type { TimerState } from '@/types';

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

  /**
   * Gestisce la modifica dell'ora di inizio
   */
  const handleStartTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTimeValue(newTime);
    
    if (onTimeChange && newTime) {
      // Se c'è un timer esistente, mantieni la sua data e cambia solo l'ora
      // Altrimenti usa la data corrente per entrambi
      const newStartISO = timeStringToISO(newTime, timer?.startTime);
      
      // Per l'end time, se esiste un timer usa la sua data, altrimenti usa la data corrente
      const endBaseDate = timer?.endTime || timer?.startTime;
      const endISO = timeStringToISO(endTimeValue, endBaseDate);
      
      if (newStartISO && endISO) {
        onTimeChange(newStartISO, endISO);
      }
    }
  }, [onTimeChange, endTimeValue, timer]);

  /**
   * Gestisce la modifica dell'ora di fine
   */
  const handleEndTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTimeValue(newTime);
    
    if (onTimeChange && newTime) {
      // Se c'è un timer esistente, mantieni la sua data e cambia solo l'ora
      // Altrimenti usa la data corrente per entrambi
      const startBaseDate = timer?.startTime;
      const startISO = timeStringToISO(startTimeValue, startBaseDate);
      
      // Per l'end time, se esiste un timer usa la sua data, altrimenti usa la data corrente
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

