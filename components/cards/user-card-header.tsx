/**
 * Component for the user card header
 * Handles the display of the name (editable in edit mode) and time ranges
 */

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, SkipForward } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { useEffect, useState } from 'react';
import type { TimerState } from '@/types';
import { useTimeInputs } from '@/hooks/use-time-inputs';

interface UserCardHeaderProps {
  name: string;
  editMode: boolean;
  timer?: TimerState;
  onNameChange: (name: string) => void;
  onTimeChange?: (startTime: string, endTime: string) => void;
}

/**
 * Card header with name and timer start/end times
 * Uses mounted flag to prevent hydration mismatch when loading from localStorage
 */
export function UserCardHeader({
  name,
  editMode,
  timer,
  onNameChange,
  onTimeChange,
}: UserCardHeaderProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted on client side
  // This prevents hydration mismatch when timer data is loaded from localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hook per gestire gli input time (stato e logica di conversione)
  const {
    startTime,
    endTime,
    startTimeValue,
    endTimeValue,
    handleStartTimeChange,
    handleEndTimeChange,
  } = useTimeInputs({
    timer,
    onTimeChange,
    mounted,
  });

  return (
    <CardHeader className="flex px-0 items-center">
      {editMode ? (
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="text-ellipsis overflow-hidden w-full whitespace-nowrap font-semibold uppercase"
          style={{ marginRight: editMode ? "2.5rem" : "0" }}
          placeholder={t('card.namePlaceholder')}
        />
      ) : (
        <CardTitle className="text-ellipsis overflow-hidden w-full whitespace-nowrap">
          {name}
        </CardTitle>
      )}

      <div className="flex items-center gap-1">
        <Play className="text-muted-foreground" size={16} />
        {mounted && onTimeChange ? (
          <Input
            type="time"
            value={startTimeValue}
            onChange={handleStartTimeChange}
            className="text-sm px-1 m-0 h-fit text-muted-foreground w-fit text-center border-transparent bg-transparent hover:bg-accent/50 focus:bg-accent/50 focus:border-input [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            style={{ 
              WebkitAppearance: 'none',
              MozAppearance: 'textfield'
            } as React.CSSProperties}
          />
        ) : (
          <span className="text-sm text-muted-foreground mr-2">{startTime}</span>
        )}
        <SkipForward className="text-muted-foreground" size={16} />
        {mounted && onTimeChange ? (
          <Input
            type="time"
            value={endTimeValue}
            onChange={handleEndTimeChange}
            className="text-sm px-1 m-0 h-fit text-muted-foreground w-fit text-center border-transparent bg-transparent hover:bg-accent/50 focus:bg-accent/50 focus:border-input [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            style={{ 
              WebkitAppearance: 'none',
              MozAppearance: 'textfield'
            } as React.CSSProperties}
          />
        ) : (
          <span className="text-sm text-muted-foreground">{endTime}</span>
        )}
      </div>
    </CardHeader>
  );
}

