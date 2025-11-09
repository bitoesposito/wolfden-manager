/**
 * App Store - Centralized Context Provider
 * Manages all application state in a centralized way
 * Optimizes timer updates with a single global interval
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { UserCard, Section, TimerState } from '@/types';
import { createCard, updateCardName, deleteCard } from '@/features/cards';
import { createSection, updateSectionName, deleteSection } from '@/features/sections';
import {
  createTimer,
  createTimerWithDates,
  updateTimerDates,
  addTimeToTimer,
  updateCardsProgress,
  calculateTimerProgress,
} from '@/features/timers';
import { loadState, saveState, type AppState } from '@/lib/storage/persistence.service';

// Initial state - empty by default
const INITIAL_CARDS: UserCard[] = [];
const INITIAL_SECTIONS: Section[] = [];

interface AppStoreContextValue {
  // Sections
  sections: Section[];
  addSection: () => void;
  updateSectionName: (id: number, name: string) => void;
  deleteSection: (id: number) => void;

  // Cards (organized by section)
  getCardsBySection: (sectionId: number) => UserCard[];
  addCard: (sectionId: number) => void;
  updateCardName: (sectionId: number, cardId: number, name: string) => void;
  deleteCard: (sectionId: number, cardId: number) => void;

  // Timers
  startTimer: (sectionId: number, cardId: number, durationMinutes: number) => void;
  startTimerWithDates: (sectionId: number, cardId: number, startTime: string, endTime: string) => void;
  updateTimerDates: (sectionId: number, cardId: number, startTime: string, endTime: string) => void;
  addTimeToTimer: (sectionId: number, cardId: number, minutes: number) => void;
  clearTimer: (sectionId: number, cardId: number) => void;
}

const AppStoreContext = createContext<AppStoreContextValue | undefined>(undefined);

/**
 * Data structure: cards organized by section
 * Map<sectionId, UserCard[]>
 */
type CardsBySection = Map<number, UserCard[]>;

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize with defaults to ensure server/client consistency
  // Load from localStorage only after mount to prevent hydration mismatch
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [cardsBySection, setCardsBySection] = useState<CardsBySection>(() => {
    return new Map<number, UserCard[]>();
  });

  // Load state from localStorage after mount (client-side only)
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setSections(saved.sections);
      
      // Recalculate progress for all cards with timers (timers may have expired)
      const map = new Map<number, UserCard[]>();
      saved.cardsBySection.forEach((cards, sectionId) => {
        const updatedCards = cards.map((card) => {
          if (card.timer) {
            // Recalculate progress based on current time
            const progress = calculateTimerProgress(card.timer);
            return { ...card, progressValue: progress };
          }
          return card;
        });
        map.set(sectionId, updatedCards);
      });
      setCardsBySection(map);
    }
  }, []); // Run only once on mount

  // Global interval to update all timers
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounce timer for saving state
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save state to localStorage whenever it changes (with debounce)
  useEffect(() => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save to avoid excessive writes
    // Save after 500ms of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      const state: AppState = {
        sections,
        cardsBySection,
      };
      saveState(state);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sections, cardsBySection]);

  /**
   * Updates progress of all active timers
   * Executed in a single global interval to optimize performance
   */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCardsBySection((prev) => {
        const updated = new Map<number, UserCard[]>();
        prev.forEach((cards, sectionId) => {
          updated.set(sectionId, updateCardsProgress(cards));
        });
        return updated;
      });
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // ========== SECTION METHODS ==========

  const handleAddSection = useCallback(() => {
    setSections((prev) => {
      const newSection = createSection(prev);
      // Create an empty card list for the new section
      setCardsBySection((prevCards) => {
        const updated = new Map(prevCards);
        updated.set(newSection.id, []);
        return updated;
      });
      return [...prev, newSection];
    });
  }, []);

  const handleUpdateSectionName = useCallback((id: number, name: string) => {
    setSections((prev) => updateSectionName(prev, id, name));
  }, []);

  const handleDeleteSection = useCallback((id: number) => {
    setSections((prev) => deleteSection(prev, id));
    // Also remove cards associated with the section
    setCardsBySection((prev) => {
      const updated = new Map(prev);
      updated.delete(id);
      return updated;
    });
  }, []);

  // ========== CARD METHODS ==========

  const getCardsBySection = useCallback(
    (sectionId: number): UserCard[] => {
      return cardsBySection.get(sectionId) || [];
    },
    [cardsBySection]
  );

  const handleAddCard = useCallback((sectionId: number) => {
    setCardsBySection((prev) => {
      const updated = new Map(prev);
      const currentCards = updated.get(sectionId) || [];
      const newCard = createCard(currentCards);
      updated.set(sectionId, [...currentCards, newCard]);
      return updated;
    });
  }, []);

  const handleUpdateCardName = useCallback(
    (sectionId: number, cardId: number, name: string) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        const currentCards = updated.get(sectionId) || [];
        const updatedCards = updateCardName(currentCards, cardId, name);
        updated.set(sectionId, updatedCards);
        return updated;
      });
    },
    []
  );

  const handleDeleteCard = useCallback((sectionId: number, cardId: number) => {
    setCardsBySection((prev) => {
      const updated = new Map(prev);
      const currentCards = updated.get(sectionId) || [];
      const updatedCards = deleteCard(currentCards, cardId);
      updated.set(sectionId, updatedCards);
      return updated;
    });
  }, []);

  // ========== TIMER METHODS ==========

  const handleStartTimer = useCallback(
    (sectionId: number, cardId: number, durationMinutes: number) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        const currentCards = updated.get(sectionId) || [];
        const updatedCards = currentCards.map((card) => {
          if (card.id === cardId) {
            const timer = createTimer(durationMinutes);
            const progress = calculateTimerProgress(timer);
            return { ...card, timer, progressValue: progress };
          }
          return card;
        });
        updated.set(sectionId, updatedCards);
        return updated;
      });
    },
    []
  );

  const handleStartTimerWithDates = useCallback(
    (sectionId: number, cardId: number, startTime: string, endTime: string) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        const currentCards = updated.get(sectionId) || [];
        const updatedCards = currentCards.map((card) => {
          if (card.id === cardId) {
            const timer = createTimerWithDates(startTime, endTime);
            const progress = calculateTimerProgress(timer);
            return { ...card, timer, progressValue: progress };
          }
          return card;
        });
        updated.set(sectionId, updatedCards);
        return updated;
      });
    },
    []
  );

  const handleUpdateTimerDates = useCallback(
    (sectionId: number, cardId: number, startTime: string, endTime: string) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        const currentCards = updated.get(sectionId) || [];
        const updatedCards = currentCards.map((card) => {
          if (card.id === cardId && card.timer?.isActive) {
            const updatedTimer = updateTimerDates(card.timer, startTime, endTime);
            const progress = calculateTimerProgress(updatedTimer);
            return { ...card, timer: updatedTimer, progressValue: progress };
          }
          return card;
        });
        updated.set(sectionId, updatedCards);
        return updated;
      });
    },
    []
  );

  const handleAddTimeToTimer = useCallback(
    (sectionId: number, cardId: number, minutes: number) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        const currentCards = updated.get(sectionId) || [];
        const updatedCards = currentCards.map((card) => {
          if (card.id === cardId && card.timer?.isActive) {
            const updatedTimer = addTimeToTimer(card.timer, minutes);
            const progress = calculateTimerProgress(updatedTimer);
            return { ...card, timer: updatedTimer, progressValue: progress };
          }
          return card;
        });
        updated.set(sectionId, updatedCards);
        return updated;
      });
    },
    []
  );

  const handleClearTimer = useCallback((sectionId: number, cardId: number) => {
    setCardsBySection((prev) => {
      const updated = new Map(prev);
      const currentCards = updated.get(sectionId) || [];
      const updatedCards = currentCards.map((card) =>
        card.id === cardId ? { ...card, timer: undefined, progressValue: 0 } : card
      );
      updated.set(sectionId, updatedCards);
      return updated;
    });
  }, []);

  const value: AppStoreContextValue = {
    // Sections
    sections,
    addSection: handleAddSection,
    updateSectionName: handleUpdateSectionName,
    deleteSection: handleDeleteSection,

    // Cards
    getCardsBySection,
    addCard: handleAddCard,
    updateCardName: handleUpdateCardName,
    deleteCard: handleDeleteCard,

    // Timers
    startTimer: handleStartTimer,
    startTimerWithDates: handleStartTimerWithDates,
    updateTimerDates: handleUpdateTimerDates,
    addTimeToTimer: handleAddTimeToTimer,
    clearTimer: handleClearTimer,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

/**
 * Hook to access the store
 */
export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }
  return context;
}


