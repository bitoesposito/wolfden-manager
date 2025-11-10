/**
 * Persistence Service
 * Handles saving and loading application state to/from localStorage
 * Manages serialization of complex data structures (Map, timestamps, etc.)
 */

import type { Section, UserCard } from '@/types';

const STORAGE_KEY = 'wolfden-manager-state';
const STORAGE_VERSION = 1;

/**
 * Serialized format for localStorage
 * Maps are converted to arrays of [key, value] pairs for JSON serialization
 */
interface SerializedState {
  version: number;
  sections: Section[];
  cardsBySection: Array<[number, UserCard[]]>;
}

/**
 * Application state structure
 */
export interface AppState {
  sections: Section[];
  cardsBySection: Map<number, UserCard[]>;
}

/**
 * Load state from localStorage
 * Returns null if no valid state is found
 */
export function loadState(): AppState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed: SerializedState = JSON.parse(stored);

    // Version check for future migrations
    if (parsed.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch: expected ${STORAGE_VERSION}, got ${parsed.version}`);
      // Could implement migration logic here
      return null;
    }

    // Convert serialized cardsBySection array back to Map
    const cardsBySection = new Map<number, UserCard[]>(parsed.cardsBySection);

    return {
      sections: parsed.sections,
      cardsBySection,
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 * Handles serialization of Map to array format
 */
export function saveState(state: AppState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Convert Map to array of [key, value] pairs for JSON serialization
    const cardsBySectionArray: Array<[number, UserCard[]]> = Array.from(
      state.cardsBySection.entries()
    );

    const serialized: SerializedState = {
      version: STORAGE_VERSION,
      sections: state.sections,
      cardsBySection: cardsBySectionArray,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old data.');
    }
  }
}


