/**
 * Utility functions for parsing text with placeholders
 * Used for rendering translated text with interactive elements (Kbd, icons, etc.)
 */

import React from 'react';
import { Kbd } from '@/components/ui/kbd';
import { PencilRuler } from 'lucide-react';

/**
 * Parses text with {shift} placeholder and replaces it with Kbd component
 */
export function parseShiftTooltip(text: string): React.ReactNode {
  const parts = text.split('{shift}');
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <Kbd className="inline-flex items-center gap-1 mx-0.5">
          Shift
        </Kbd>
      )}
    </React.Fragment>
  ));
}

/**
 * Parses text with {editButton} placeholder and replaces it with Kbd component with icon
 */
export function parseEditButtonTooltip(text: string): React.ReactNode {
  const parts = text.split('{editButton}');
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <Kbd className="inline-flex items-center gap-1">
          <PencilRuler className="h-3 w-3" />
        </Kbd>
      )}
    </React.Fragment>
  ));
}

