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
const TIMEZONE = 'Europe/Rome';
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
 * Gets the current ISO timestamp in the configured timezone
 * @returns ISO timestamp (e.g. "2024-01-15T14:30:00+01:00")
 */
export function getCurrentTimestamp(): string {
  return dayjs().tz(TIMEZONE).toISOString();
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
 * @param endTimestamp - End ISO timestamp
 * @returns Remaining seconds (negative if expired, positive if still active)
 */
export function getRemainingSeconds(endTimestamp: string | null): number {
  if (!endTimestamp) return 0;
  
  const now = dayjs().tz(TIMEZONE);
  const endTime = dayjs(endTimestamp).tz(TIMEZONE);
  return endTime.diff(now, 'second');
}

/**
 * Calculates progress percentage based on initial duration and remaining seconds
 * Uses seconds to ensure precise updates every second
 * @param initialMinutes - Initial duration in minutes
 * @param remainingSeconds - Remaining seconds (can be negative if expired)
 * @returns Progress percentage (0-100, or >100 if expired to show red progress bar)
 */
export function calculateProgress(initialMinutes: number, remainingSeconds: number): number {
  if (initialMinutes <= 0) return 0;
  
  // Convert initial duration to seconds for precise calculation
  const initialSeconds = initialMinutes * 60;
  
  // If time expired (negative value), return > 100
  // to indicate the progress bar should be red
  if (remainingSeconds < 0) {
    // Calculate how much time has passed beyond expiration
    const overtimeSeconds = Math.abs(remainingSeconds);
    // Return 100 + a percentage based on expired time
    // Limit to 200% to avoid excessive values
    return Math.min(200, 100 + (overtimeSeconds / initialSeconds) * 100);
  }
  
  // Calculate percentage with second precision
  const progress = (remainingSeconds / initialSeconds) * 100;
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
