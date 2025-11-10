/**
 * Utility functions for keyboard event handling
 * Centralizes common keyboard event checks and helpers
 */

/**
 * Checks if the event target is an input field (input, textarea, or contentEditable)
 * Used to prevent shortcuts from triggering when user is typing
 */
export function isInputField(target: EventTarget | null): boolean {
  if (!target) return false;
  
  const element = target as HTMLElement;
  return (
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.isContentEditable
  );
}

/**
 * Checks if Ctrl (or Cmd on Mac) is pressed
 */
export function isCtrlOrCmd(e: KeyboardEvent | WheelEvent): boolean {
  return !!(e.ctrlKey || e.metaKey);
}

/**
 * Checks if the keyboard event matches a specific key
 * Case-insensitive comparison
 */
export function isKey(e: KeyboardEvent, key: string): boolean {
  return e.key.toLowerCase() === key.toLowerCase();
}

/**
 * Checks if the keyboard event matches Ctrl/Cmd + key combination
 * Also checks that Shift and Alt are not pressed
 */
export function isCtrlKey(
  e: KeyboardEvent,
  key: string,
  allowShift = false,
  allowAlt = false
): boolean {
  if (!isCtrlOrCmd(e)) return false;
  if (e.shiftKey && !allowShift) return false;
  if (e.altKey && !allowAlt) return false;
  return isKey(e, key);
}

