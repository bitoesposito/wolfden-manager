/**
 * Hook to manage time inputs for timer start/end times
 * Handles state management and conversion between time strings and ISO timestamps
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  timestampToTimeString, 
  timeStringToISO, 
  adjustEndTimeForMidnightCrossing,
  getCurrentTimeString
} from '@/lib/utils/time';
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

  // Handler per onChange: aggiorna solo lo stato locale per mostrare in tempo reale
  // Non aggiorna il timer per evitare suoni durante la digitazione
  const handleStartTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTimeValue(newTime);
  }, []);

  // Handler per onBlur: aggiorna il timer solo quando l'utente finisce di modificare
  const handleStartTimeBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let newTime = e.target.value;
    
    // Se il campo è vuoto, imposta l'ora attuale
    if (!newTime) {
      newTime = getCurrentTimeString();
      setStartTimeValue(newTime);
    }
    
    if (onTimeChange && newTime) {
      // Keep date from existing timer, change only time; otherwise use current date
      const newStartISO = timeStringToISO(newTime, timer?.startTime);
      
      if (!newStartISO) return;
      
      // Per l'ora di fine, usa sempre la data dell'ora di inizio come base
      const baseDateForEnd = newStartISO || timer?.startTime;
      let endISO = timeStringToISO(endTimeValue, baseDateForEnd);
      
      // Se l'ora di fine è minore dell'ora di inizio, aggiungi un giorno all'ora di fine
      if (endISO && endTimeValue) {
        endISO = adjustEndTimeForMidnightCrossing(newStartISO, endTimeValue);
        onTimeChange(newStartISO, endISO);
      }
    }
  }, [onTimeChange, endTimeValue, timer]);

  // Handler per onChange: aggiorna solo lo stato locale per mostrare in tempo reale
  // Non aggiorna il timer per evitare suoni durante la digitazione
  const handleEndTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTimeValue(newTime);
  }, []);

  // Handler per onBlur: aggiorna il timer solo quando l'utente finisce di modificare
  const handleEndTimeBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    let newTime = e.target.value;
    
    // Se il campo è vuoto, imposta l'ora attuale
    if (!newTime) {
      newTime = getCurrentTimeString();
      setEndTimeValue(newTime);
    }
    
    if (onTimeChange && newTime) {
      let startISO: string;
      
      if (timer?.startTime) {
        // Existing timer: keep existing start time
        startISO = timeStringToISO(startTimeValue, timer.startTime);
      } else {
        // No timer: set start time to current time when entering end time
        const currentTime = getCurrentTimeString();
        setStartTimeValue(currentTime);
        startISO = timeStringToISO(currentTime, null);
      }
      
      if (!startISO) return;
      
      // Per l'ora di fine, usa sempre la data dell'ora di inizio come base
      // Questo garantisce che se l'ora di fine è minore, possiamo aggiungere un giorno correttamente
      const newEndISO = adjustEndTimeForMidnightCrossing(startISO, newTime);
      onTimeChange(startISO, newEndISO);
    }
  }, [onTimeChange, startTimeValue, timer]);

  return {
    startTime,
    endTime,
    startTimeValue,
    endTimeValue,
    handleStartTimeChange,
    handleStartTimeBlur,
    handleEndTimeChange,
    handleEndTimeBlur,
  };
}

