/**
 * Hook to handle global keyboard shortcuts for the application
 * Manages shortcuts that work anywhere in the app (not card-specific)
 */

import { useEffect } from 'react';
import { isCtrlKey, isInputField } from '@/lib/utils/keyboard';

interface UseGlobalShortcutsProps {
  onToggleEditMode?: () => void;
  onToggleAudio?: () => void;
}

/**
 * Global keyboard shortcuts:
 * - Ctrl+E: Toggle edit mode
 * - Ctrl+M: Toggle audio mute
 * 
 * These shortcuts work globally but are disabled when user is typing in input fields
 */
export function useGlobalShortcuts({
  onToggleEditMode,
  onToggleAudio,
}: UseGlobalShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input field
      if (isInputField(e.target)) return;

      // Ctrl+E: Toggle edit mode
      if (onToggleEditMode && isCtrlKey(e, 'e')) {
        e.preventDefault();
        onToggleEditMode();
        return;
      }

      // Ctrl+M: Toggle audio
      if (onToggleAudio && isCtrlKey(e, 'm')) {
        e.preventDefault();
        onToggleAudio();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleEditMode, onToggleAudio]);
}

