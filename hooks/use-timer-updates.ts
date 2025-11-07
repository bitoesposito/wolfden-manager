/**
 * Optimized hook for timer updates
 * Handles periodic progress updates
 * Now handled centrally in the store, this hook is deprecated
 * Kept for compatibility if needed
 */

import { useEffect } from 'react';
import type { UserCard } from '@/types';
import { updateCardsProgress } from '@/features/timers';

/**
 * @deprecated Updates are now handled centrally in the store
 * This hook is kept for reference only
 */
export function useTimerUpdates(
  cards: UserCard[],
  setCards: (cards: UserCard[] | ((prev: UserCard[]) => UserCard[])) => void
) {
  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => updateCardsProgress(prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [setCards]);
}

