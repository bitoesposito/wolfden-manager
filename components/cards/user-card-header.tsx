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
import { TimeInputField } from '@/components/cards/time-input-field';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    startTime,
    endTime,
    startTimeValue,
    endTimeValue,
    handleStartTimeChange,
    handleStartTimeBlur,
    handleEndTimeChange,
    handleEndTimeBlur,
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
        <CardTitle className="text-ellipsis overflow-hidden w-full whitespace-nowrap select-none">
          {name}
        </CardTitle>
      )}

      <div className="flex items-center gap-1">
        <Play className="text-muted-foreground" size={16} />
        <TimeInputField
          value={startTimeValue}
          onChange={handleStartTimeChange}
          onBlur={handleStartTimeBlur}
          displayValue={startTime}
          mounted={mounted}
          editable={!!onTimeChange}
        />
        <SkipForward className="text-muted-foreground" size={16} />
        <TimeInputField
          value={endTimeValue}
          onChange={handleEndTimeChange}
          onBlur={handleEndTimeBlur}
          displayValue={endTime}
          mounted={mounted}
          editable={!!onTimeChange}
        />
      </div>
    </CardHeader>
  );
}