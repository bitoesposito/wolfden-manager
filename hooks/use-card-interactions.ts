/**
 * Hook to handle card interactions (hover, keyboard shortcuts, double click)
 * Separated from business logic to improve separation of concerns
 */

import { useState, useEffect, useCallback } from 'react';

interface UseCardInteractionsProps {
  isTimerActive: boolean;
  onStartTimer: (durationMinutes: number) => void;
  onAddTime: (minutes: number) => void;
  onOpenCustomDialog: () => void;
}

/**
 * Handles user interactions with the card:
 * - Hover state to enable keyboard shortcuts
 * - Keyboard shortcuts (Ctrl+1, Ctrl+2)
 * - Double click to open custom dialog
 */
export function useCardInteractions({
  isTimerActive,
  onStartTimer,
  onAddTime,
  onOpenCustomDialog,
}: UseCardInteractionsProps) {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handles keyboard shortcuts when the card is hovered
   * Ctrl+1: add/start 1 hour
   * Ctrl+2: add/start 2 hours
   */
  useEffect(() => {
    if (!isHovered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check that Ctrl (or Cmd on Mac) is pressed
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          if (isTimerActive) {
            onAddTime(60);
          } else {
            onStartTimer(60);
          }
        } else if (e.key === '2') {
          e.preventDefault();
          if (isTimerActive) {
            onAddTime(120);
          } else {
            onStartTimer(120);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, isTimerActive, onAddTime, onStartTimer]);

  /**
   * Handles double click on the card to open custom dialog
   */
  const handleDoubleClick = useCallback(() => {
    onOpenCustomDialog();
  }, [onOpenCustomDialog]);

  /**
   * Handles card hover
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    handleDoubleClick,
    handleMouseEnter,
    handleMouseLeave,
  };
}

