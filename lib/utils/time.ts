/**
 * Utility functions for time management
 * Centralizes all calculation, formatting, and manipulation logic for time
 * Uses complete ISO timestamps to properly handle dates and times
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configure dayjs with timezone plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// Configuration constants
export const TIMEZONE = 'Europe/Rome';
const TIME_FORMAT = 'HH:mm';
const TIME_FORMAT_WITH_SECONDS = 'HH:mm:ss';

/**
 * Gets the current time formatted as HH:mm string in the configured timezone
 * @returns String in HH:mm format (for UI display)
 */
export function getCurrentTimeString(): string {
  return dayjs().tz(TIMEZONE).format(TIME_FORMAT);
}

/**
 * Gets the current time formatted as HH:mm:ss string in the configured timezone
 * Includes seconds for precise time display
 * @returns String in HH:mm:ss format (for time input)
 */
export function getCurrentTimeStringWithSeconds(): string {
  return dayjs().tz(TIMEZONE).format(TIME_FORMAT_WITH_SECONDS);
}

/**
 * Creates an ISO timestamp by adding minutes to the current time
 * @param minutes - Minutes to add (can be negative to subtract)
 * @returns ISO timestamp
 */
export function addMinutesToCurrentTime(minutes: number): string {
  const now = dayjs().tz(TIMEZONE);
  const endTime = now.add(minutes, 'minute');
  return endTime.toISOString();
}

/**
 * Adds minutes to an existing ISO timestamp
 * @param timestamp - Existing ISO timestamp
 * @param minutes - Minutes to add (can be negative to subtract)
 * @returns New ISO timestamp
 */
export function addMinutesToTimestamp(timestamp: string, minutes: number): string {
  const time = dayjs(timestamp).tz(TIMEZONE);
  const newTime = time.add(minutes, 'minute');
  return newTime.toISOString();
}

/**
 * Converts an ISO timestamp to HH:mm format for display
 * @param timestamp - ISO timestamp
 * @returns String in HH:mm format
 */
export function timestampToTimeString(timestamp: string | null): string {
  if (!timestamp) return '00:00';
  return dayjs(timestamp).tz(TIMEZONE).format(TIME_FORMAT);
}

/**
 * Converts a time string (HH:mm) to ISO timestamp maintaining the date from base timestamp
 * If no base timestamp is provided, uses current date
 * @param timeString - Time string in HH:mm format
 * @param baseTimestamp - Optional ISO timestamp to maintain the date from
 * @returns ISO timestamp with the time from timeString and date from baseTimestamp (or current date)
 */
export function timeStringToISO(timeString: string, baseTimestamp?: string | null): string {
  if (!timeString) return '';
  
  // Keep date from base timestamp and change only time; otherwise use current date
  const baseDate = baseTimestamp 
    ? dayjs(baseTimestamp).tz(TIMEZONE)
    : dayjs().tz(TIMEZONE);
  
  const [hours, minutes] = timeString.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  // Keep original date and change only time
  const dateTime = baseDate.hour(hours).minute(minutes).second(0).millisecond(0);
  return dateTime.toISOString();
}

/**
 * Normalizes hours and minutes into a valid format
 * Handles carry-over when minutes exceed 60 or are negative
 * @param hours - Hours (can be negative)
 * @param minutes - Minutes (can be negative)
 * @returns Object with normalized hours and minutes
 */
export function normalizeTime(hours: number, minutes: number): { hours: number; minutes: number } {
  let normalizedHours = hours;
  let normalizedMinutes = minutes;

  // Handle minute carry-over
  if (Math.abs(normalizedMinutes) >= 60) {
    const hoursToAdd = Math.floor(normalizedMinutes / 60);
    normalizedHours += hoursToAdd;
    normalizedMinutes = normalizedMinutes % 60;
    
    // If minutes are negative after modulo, adjust
    if (normalizedMinutes < 0) {
      normalizedHours -= 1;
      normalizedMinutes += 60;
    }
  }

  return {
    hours: normalizedHours,
    minutes: normalizedMinutes,
  };
}

/**
 * Converts hours and minutes to total minutes
 * @param hours - Hours
 * @param minutes - Minutes
 * @returns Total minutes
 */
export function toTotalMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/**
 * Calculates remaining seconds between current time and end timestamp
 * Uses complete ISO timestamps for precise calculations based on real dates
 * If startTime is provided and current time is before startTime, returns full duration
 * @param endTimestamp - End ISO timestamp
 * @param startTimestamp - Optional start ISO timestamp (if timer hasn't started yet)
 * @returns Remaining seconds (negative if expired, positive if still active)
 */
export function getRemainingSeconds(endTimestamp: string | null, startTimestamp?: string | null): number {
  if (!endTimestamp) return 0;
  
  const now = dayjs().tz(TIMEZONE);
  const endTime = dayjs(endTimestamp).tz(TIMEZONE);
  
  // Se c'è un'ora di inizio e l'ora attuale è prima dell'ora di inizio,
  // il timer non è ancora iniziato, quindi restituisci la durata totale
  if (startTimestamp) {
    const startTime = dayjs(startTimestamp).tz(TIMEZONE);
    if (now.isBefore(startTime)) {
      // Timer non ancora iniziato: restituisci la durata totale
      return endTime.diff(startTime, 'second');
    }
  }
  
  // Timer già iniziato o senza ora di inizio: calcola tempo rimanente fino alla fine
  return endTime.diff(now, 'second');
}

/**
 * Calculates progress percentage based on initial duration and remaining seconds
 * Uses seconds to ensure precise updates every second
 * The bar stays at 100% while remaining time is greater than 1 hour,
 * then starts decreasing based on the last hour
 * @param initialMinutes - Initial duration in minutes
 * @param remainingSeconds - Remaining seconds (can be negative if expired)
 * @returns Progress percentage (0-100, or >100 if expired to show red progress bar)
 */
export function calculateProgress(initialMinutes: number, remainingSeconds: number): number {
  if (initialMinutes <= 0) return 0;
  
  // Convert initial duration to seconds for precise calculation
  const initialSeconds = initialMinutes * 60;
  const ONE_HOUR_IN_SECONDS = 3600;
  
  // If time expired (negative value), return > 100
  // to indicate the progress bar should be red
  if (remainingSeconds < 0) {
    // Calculate how much time has passed beyond expiration
    const overtimeSeconds = Math.abs(remainingSeconds);
    // Return 100 + a percentage based on expired time
    // Limit to 200% to avoid excessive values
    return Math.min(200, 100 + (overtimeSeconds / ONE_HOUR_IN_SECONDS) * 100);
  }
  
  // If remaining time is greater than 1 hour, bar is always at 100%
  if (remainingSeconds > ONE_HOUR_IN_SECONDS) {
    return 100;
  }
  
  // When remaining time is <= 1 hour, calculate progress based on last hour
  // Progress goes from 100% (1 hour remaining) to 0% (0 seconds remaining)
  const progress = (remainingSeconds / ONE_HOUR_IN_SECONDS) * 100;
  return Math.max(0, Math.min(100, progress));
}

/**
 * Checks if the timer is expired
 * @param remainingSeconds - Remaining seconds
 * @returns true if the timer is expired
 */
export function isTimerExpired(remainingSeconds: number): boolean {
  return remainingSeconds < 0;
}

/**
 * Formats remaining seconds in MM:SS or HH:MM:SS format
 * Always shows seconds for better precision
 * If time expired, shows expired time with + sign
 * @param seconds - Seconds to format (can be negative if expired)
 * @returns Formatted string (e.g. "05:30", "1:05:30", or "+00:30" if expired)
 */
export function formatRemainingTime(seconds: number): string {
  const isExpired = seconds < 0;
  const absSeconds = Math.abs(seconds);
  
  if (absSeconds === 0) return '00:00';
  
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;
  
  let formatted: string;
  
  // If there are hours, show HH:MM:SS format, otherwise MM:SS (always with seconds)
  if (hours > 0) {
    formatted = `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    // Always show seconds even when no hours
    formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  // If expired, add + sign
  return isExpired ? `+${formatted}` : formatted;
}

/**
 * Adjusts end time to next day if it's before start time
 * Handles cross-midnight scenarios (e.g., 23:30 start, 01:00 end)
 * @param startISO - Start ISO timestamp
 * @param endTimeString - End time string in HH:mm format
 * @returns Adjusted end ISO timestamp (with +1 day if needed)
 */
export function adjustEndTimeForMidnightCrossing(
  startISO: string,
  endTimeString: string
): string {
  const startDateTime = dayjs(startISO).tz(TIMEZONE);
  const [hours, minutes] = endTimeString.split(':').map(Number);
  
  // Create end time on the same date as start
  let endDateTime = startDateTime.hour(hours).minute(minutes).second(0).millisecond(0);
  
  // Extract time-only strings for comparison
  const startTimeOnly = startDateTime.format('HH:mm');
  const endTimeOnly = endDateTime.format('HH:mm');
  
  // If end time is before start time, add one day
  if (endTimeOnly < startTimeOnly) {
    endDateTime = endDateTime.add(1, 'day');
  }
  
  return endDateTime.toISOString();
}

/**
 * Calculates progress bar variant based on remaining time
 * @param remainingSeconds - Remaining seconds (can be negative if expired)
 * @returns Progress bar variant: "default" | "warning" | "orange" | "destructive"
 */
export function calculateProgressVariant(
  remainingSeconds: number
): "default" | "warning" | "orange" | "destructive" {
  // If 00:00 (remainingSeconds === 0), always use default
  if (remainingSeconds === 0) {
    return "default";
  }
  
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const isExpired = remainingSeconds < 0;
  
  if (isExpired || remainingMinutes <= 10) {
    return "destructive";
  } else if (remainingMinutes <= 20) {
    return "orange";
  } else if (remainingMinutes <= 30) {
    return "warning";
  }
  
  return "default";
}
