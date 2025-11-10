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
  swapCardTimers: (sectionId1: number, cardId1: number, sectionId2: number, cardId2: number) => void;
  
  // Utilities
  getAllCards: () => Array<{ sectionId: number; sectionName: string; card: UserCard }>;
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
  const [sections, setSections] = useState<Section[]>([]);
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
  
  /**
   * Helper function to update a specific card in a section
   * Reduces code duplication across timer methods
   */
  const updateCardInSection = useCallback(
    (
      sectionId: number,
      cardId: number,
      updater: (card: UserCard) => UserCard,
      condition?: (card: UserCard) => boolean
    ) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        const currentCards = updated.get(sectionId) || [];
        const updatedCards = currentCards.map((card) => {
          if (card.id === cardId && (!condition || condition(card))) {
            return updater(card);
          }
          return card;
        });
        updated.set(sectionId, updatedCards);
        return updated;
      });
    },
    []
  );

  const handleStartTimer = useCallback(
    (sectionId: number, cardId: number, durationMinutes: number) => {
      updateCardInSection(
        sectionId,
        cardId,
        (card) => {
          const timer = createTimer(durationMinutes);
          const progress = calculateTimerProgress(timer);
          return { ...card, timer, progressValue: progress };
        }
      );
    },
    [updateCardInSection]
  );

  const handleStartTimerWithDates = useCallback(
    (sectionId: number, cardId: number, startTime: string, endTime: string) => {
      updateCardInSection(
        sectionId,
        cardId,
        (card) => {
          const timer = createTimerWithDates(startTime, endTime);
          const progress = calculateTimerProgress(timer);
          return { ...card, timer, progressValue: progress };
        }
      );
    },
    [updateCardInSection]
  );

  const handleUpdateTimerDates = useCallback(
    (sectionId: number, cardId: number, startTime: string, endTime: string) => {
      updateCardInSection(
        sectionId,
        cardId,
        (card) => {
          const updatedTimer = updateTimerDates(card.timer!, startTime, endTime);
          const progress = calculateTimerProgress(updatedTimer);
          return { ...card, timer: updatedTimer, progressValue: progress };
        },
        (card) => card.timer?.isActive === true
      );
    },
    [updateCardInSection]
  );

  const handleAddTimeToTimer = useCallback(
    (sectionId: number, cardId: number, minutes: number) => {
      updateCardInSection(
        sectionId,
        cardId,
        (card) => {
          const updatedTimer = addTimeToTimer(card.timer!, minutes);
          const progress = calculateTimerProgress(updatedTimer);
          return { ...card, timer: updatedTimer, progressValue: progress };
        },
        (card) => card.timer?.isActive === true
      );
    },
    [updateCardInSection]
  );

  const handleClearTimer = useCallback((sectionId: number, cardId: number) => {
    updateCardInSection(
      sectionId,
      cardId,
      (card) => ({ ...card, timer: undefined, progressValue: 0 })
    );
  }, [updateCardInSection]);

  /**
   * Swaps timers between two cards
   * Updates progressValue after swap
   */
  const handleSwapCardTimers = useCallback(
    (sectionId1: number, cardId1: number, sectionId2: number, cardId2: number) => {
      setCardsBySection((prev) => {
        const updated = new Map(prev);
        
        const originalCards1 = [...(updated.get(sectionId1) || [])];
        const originalCards2 = [...(updated.get(sectionId2) || [])];

        const card1Index = originalCards1.findIndex((c) => c.id === cardId1);
        const card2Index = originalCards2.findIndex((c) => c.id === cardId2);

        if (card1Index === -1 || card2Index === -1) return prev;

        const card1 = originalCards1[card1Index];
        const card2 = originalCards2[card2Index];

        const timer1 = card1.timer ? { ...card1.timer } : undefined;
        const timer2 = card2.timer ? { ...card2.timer } : undefined;

        const progress1 = timer2 ? calculateTimerProgress(timer2) : 0;
        const progress2 = timer1 ? calculateTimerProgress(timer1) : 0;

        if (sectionId1 === sectionId2) {
          const newCards = originalCards1.map((card, index) => {
            if (index === card1Index) {
              return { ...card, timer: timer2, progressValue: progress1 };
            }
            if (index === card2Index) {
              return { ...card, timer: timer1, progressValue: progress2 };
            }
            return card;
          });
          updated.set(sectionId1, newCards);
        } else {
          const newCards1 = originalCards1.map((card, index) =>
            index === card1Index
              ? { ...card, timer: timer2, progressValue: progress1 }
              : card
          );

          const newCards2 = originalCards2.map((card, index) =>
            index === card2Index
              ? { ...card, timer: timer1, progressValue: progress2 }
              : card
          );

          updated.set(sectionId1, newCards1);
          updated.set(sectionId2, newCards2);
        }

        return updated;
      });
    },
    []
  );

  /**
   * Returns all cards with their sections
   * Useful for search and selection
   */
  const getAllCards = useCallback(() => {
    const result: Array<{ sectionId: number; sectionName: string; card: UserCard }> = [];
    
    sections.forEach((section) => {
      const cards = cardsBySection.get(section.id) || [];
      cards.forEach((card) => {
        result.push({
          sectionId: section.id,
          sectionName: section.name,
          card,
        });
      });
    });

    return result;
  }, [sections, cardsBySection]);

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
    swapCardTimers: handleSwapCardTimers,

    // Utilities
    getAllCards,
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


