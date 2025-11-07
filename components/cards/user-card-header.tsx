/**
 * Component for the user card header
 * Handles the display of the name (editable in edit mode) and time ranges
 */

import { CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, SkipForward } from 'lucide-react';
import { timestampToTimeString } from '@/lib/utils/time';
import { useI18n } from '@/hooks/use-i18n';
import { useEffect, useState } from 'react';
import type { TimerState } from '@/types';

interface UserCardHeaderProps {
  name: string;
  editMode: boolean;
  timer?: TimerState;
  onNameChange: (name: string) => void;
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
}: UserCardHeaderProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted on client side
  // This prevents hydration mismatch when timer data is loaded from localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert ISO timestamp to HH:mm for display
  // Only show actual values after mount to avoid hydration mismatch
  const startTime = mounted ? timestampToTimeString(timer?.startTime ?? null) : '00:00';
  const endTime = mounted ? timestampToTimeString(timer?.endTime ?? null) : '00:00';

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
        <span className="text-sm text-muted-foreground mr-2">{startTime}</span>
        <SkipForward className="text-muted-foreground" size={16} />
        <span className="text-sm text-muted-foreground">{endTime}</span>
      </div>
    </CardHeader>
  );
}

