/**
 * Utility functions for time formatting and manipulation
 */

const TIMEZONE = 'Europe/Rome';
const LOCALE = 'it-IT';

/**
 * Formats current time as HH:mm string
 */
export function getCurrentTimeString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const hour = parts.find((p) => p.type === 'hour')?.value || '00';
  const minute = parts.find((p) => p.type === 'minute')?.value || '00';

  return `${hour}:${minute}`;
}

/**
 * Adds minutes to a time string (HH:mm format) and returns new time string
 */
export function addMinutesToTime(timeString: string, minutes: number): string {
  const [hours, mins] = timeString.split(':').map(Number);
  const now = new Date();
  const date = new Date();
  
  // Set to today with the given time
  date.setHours(hours, mins, 0, 0);
  
  // Add minutes
  date.setMinutes(date.getMinutes() + minutes);
  
  // If the result is earlier than now, it means we've wrapped to next day
  // This is handled by the date object automatically
  
  const formatter = new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour')?.value || '00';
  const minute = parts.find((p) => p.type === 'minute')?.value || '00';

  return `${hour}:${minute}`;
}

/**
 * Calculates remaining minutes between current time and end time
 */
export function getRemainingMinutes(endTimeString: string): number {
  const now = new Date();
  const [endHours, endMins] = endTimeString.split(':').map(Number);
  
  const endDate = new Date();
  endDate.setHours(endHours, endMins, 0, 0);
  
  // If end time is earlier than current time, assume it's next day
  if (endDate < now) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  const diffMs = endDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

/**
 * Calculates progress percentage based on initial duration and remaining time
 */
export function calculateProgress(initialMinutes: number, remainingMinutes: number): number {
  if (initialMinutes <= 0) return 0;
  return Math.max(0, Math.min(100, (remainingMinutes / initialMinutes) * 100));
}

