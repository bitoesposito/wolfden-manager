/**
 * Hook to handle card interactions (hover, keyboard shortcuts, double click, scroll)
 * Separated from business logic to improve separation of concerns
 */

import { useState, useEffect, useCallback } from 'react';
import { isCtrlOrCmd, isKey } from '@/lib/utils/keyboard';

interface UseCardInteractionsProps {
  isTimerActive: boolean;
  onStartTimer: (durationMinutes: number) => void;
  onAddTime: (minutes: number) => void;
  onOpenCustomDialog: () => void;
  onSwapCard?: () => void;
  onClearTimer?: () => void;
  canSwapCard?: boolean;
}

/**
 * Handles user interactions with the card:
 * - Hover state to enable keyboard shortcuts
 * - Keyboard shortcuts (Ctrl+1, Ctrl+2, Ctrl+3, Ctrl+S, Ctrl+R)
 * - Scroll with Ctrl to adjust time by 5 minutes
 * - Double click to open custom dialog
 */
export function useCardInteractions({
  isTimerActive,
  onStartTimer,
  onAddTime,
  onOpenCustomDialog,
  onSwapCard,
  onClearTimer,
  canSwapCard = false,
}: UseCardInteractionsProps) {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handles keyboard shortcuts when the card is hovered
   * Ctrl+1: add/start 1 hour
   * Ctrl+2: add/start 2 hours
   * Ctrl+3: add 30 minutes (only when timer is active)
   * Ctrl+S: swap card (only when timer is active)
   * Ctrl+R: reset timer (only when timer is active)
   */
  useEffect(() => {
    if (!isHovered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check that Ctrl (or Cmd on Mac) is pressed, without Shift or Alt
      if (!isCtrlOrCmd(e) || e.shiftKey || e.altKey) return;

      // Timer-specific shortcuts (only when timer is active)
      if (isTimerActive) {
        // Ctrl+S: swap card
        if (isKey(e, 's') && onSwapCard && canSwapCard) {
          e.preventDefault();
          onSwapCard();
          return;
        }
        // Ctrl+R: reset timer
        if (isKey(e, 'r') && onClearTimer) {
          e.preventDefault();
          onClearTimer();
          return;
        }
      }

      // Map keyboard shortcuts to duration in minutes
      const shortcuts: Record<string, number> = {
        '1': 60,
        '2': 120,
        '3': 30, // Works for both starting timer and adding time
      };

      const duration = shortcuts[e.key];
      if (duration) {
        e.preventDefault();
        
        if (isTimerActive) {
          onAddTime(duration);
        } else {
          onStartTimer(duration);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, isTimerActive, onAddTime, onStartTimer, onSwapCard, onClearTimer, canSwapCard]);

  /**
   * Handles scroll with Ctrl pressed to adjust time
   * Ctrl+Scroll: ±1 minute
   * Ctrl+Shift+Scroll: ±5 minutes
   * Scroll up: add time, Scroll down: remove time
   */
  useEffect(() => {
    if (!isHovered || !isTimerActive) return;

    const handleWheel = (e: WheelEvent) => {
      // Check that Ctrl (or Cmd on Mac) is pressed
      if (!isCtrlOrCmd(e)) return;

      // Prevent default scroll behavior
      e.preventDefault();

      // Determine amount: Ctrl+Shift = 5 minutes, Ctrl only = 1 minute
      const amount = e.shiftKey ? 5 : 1;
      
      // Determine direction: positive deltaY = scroll down (remove time), negative = scroll up (add time)
      const minutes = e.deltaY > 0 ? -amount : amount;
      onAddTime(minutes);
    };

    // Attach to window to catch scroll events even when not directly on the card
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isHovered, isTimerActive, onAddTime]);

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

