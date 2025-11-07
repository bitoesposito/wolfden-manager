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
      let startISO: string;
      
      if (timer?.startTime) {
        // Timer esistente: mantieni l'ora di inizio esistente
        startISO = timeStringToISO(startTimeValue, timer.startTime);
      } else {
        // Nessun timer: imposta l'ora di inizio all'ora corrente (quando si inserisce l'ora di fine)
        // Usa la data/ora corrente come base per l'ora di inizio
        const currentTime = dayjs().tz('Europe/Rome').format('HH:mm');
        setStartTimeValue(currentTime);
        startISO = timeStringToISO(currentTime, null);
      }
      
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

