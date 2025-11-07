/**
 * Hook to get cards for a specific section
 * Optimized wrapper for useAppStore
 */

import { useMemo } from 'react';
import { useAppStore } from '@/store/app-store';

/**
 * Hook to get cards for a specific section
 * Memoizes the result to avoid unnecessary re-renders
 */
export function useSectionCards(sectionId: number) {
  const { getCardsBySection } = useAppStore();

  return useMemo(() => getCardsBySection(sectionId), [getCardsBySection, sectionId]);
}

