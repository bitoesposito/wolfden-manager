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

