/**
 * Keyboard Shortcuts Documentation
 * 
 * This file documents all keyboard shortcuts available in the application.
 * Shortcuts are organized by scope (global vs card-specific).
 */

/**
 * Global Shortcuts
 * These shortcuts work anywhere in the application (except when typing in input fields)
 */
export const GLOBAL_SHORTCUTS = {
  /**
   * Toggle edit mode
   * - Activates/deactivates edit mode for managing sections and cards
   * - Validates names before exiting edit mode
   */
  TOGGLE_EDIT_MODE: {
    key: 'Ctrl+E',
    description: 'Toggle edit mode / Save changes',
  },

  /**
   * Toggle audio mute
   * - Mutes/unmutes audio notifications
   */
  TOGGLE_AUDIO: {
    key: 'Ctrl+M',
    description: 'Toggle audio mute',
  },
} as const;

/**
 * Card-Specific Shortcuts
 * These shortcuts only work when a card is hovered
 */
export const CARD_SHORTCUTS = {
  /**
   * Timer duration shortcuts
   * - Ctrl+1: Add/Start 1 hour
   * - Ctrl+2: Add/Start 2 hours
   * - Ctrl+3: Add/Start 30 minutes
   */
  TIMER_DURATIONS: {
    ONE_HOUR: {
      key: 'Ctrl+1',
      description: 'Add/Start 1 hour',
    },
    TWO_HOURS: {
      key: 'Ctrl+2',
      description: 'Add/Start 2 hours',
    },
    THIRTY_MINUTES: {
      key: 'Ctrl+3',
      description: 'Add/Start 30 minutes',
    },
  },

  /**
   * Timer management shortcuts (only when timer is active)
   * - Ctrl+S: Swap card timer with another card
   * - Ctrl+R: Reset timer
   */
  TIMER_MANAGEMENT: {
    SWAP_CARD: {
      key: 'Ctrl+S',
      description: 'Swap card timer',
      condition: 'Timer must be active',
    },
    RESET_TIMER: {
      key: 'Ctrl+R',
      description: 'Reset timer',
      condition: 'Timer must be active',
    },
  },

  /**
   * Scroll shortcuts (only when timer is active and card is hovered)
   * - Ctrl+Scroll: Adjust time by ±1 minute
   * - Ctrl+Shift+Scroll: Adjust time by ±5 minutes
   * - Scroll up: Add time
   * - Scroll down: Remove time
   */
  SCROLL_ADJUST: {
    FINE: {
      key: 'Ctrl+Scroll',
      description: 'Adjust time by ±1 minute',
      condition: 'Timer must be active, card must be hovered',
    },
    COARSE: {
      key: 'Ctrl+Shift+Scroll',
      description: 'Adjust time by ±5 minutes',
      condition: 'Timer must be active, card must be hovered',
    },
  },
} as const;

/**
 * All shortcuts combined for reference
 */
export const ALL_SHORTCUTS = {
  global: GLOBAL_SHORTCUTS,
  card: CARD_SHORTCUTS,
} as const;

