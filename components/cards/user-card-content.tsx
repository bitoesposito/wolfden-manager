/**
 * Component for the user card content
 * Handles the progress bar, quick action buttons, and delete button
 */

import { CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ClockPlus, ClockFading, X } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

interface UserCardContentProps {
  progressValue: number;
  isExpired: boolean;
  progressVariant: 'default' | 'warning' | 'orange' | 'destructive' | undefined;
  remainingTime: string;
  isTimerActive: boolean;
  editMode: boolean;
  cardName: string;
  onQuickAdd: () => void;
  onClearTimer: () => void;
  onDeleteCard: () => void;
}

/**
 * Card content with progress bar and action buttons
 */
export function UserCardContent({
  progressValue,
  isExpired,
  progressVariant,
  remainingTime,
  isTimerActive,
  editMode,
  cardName,
  onQuickAdd,
  onClearTimer,
  onDeleteCard,
}: UserCardContentProps) {
  const { t } = useI18n();

  return (
    <CardContent className="px-0 flex gap-2 items-center">
      <div className="flex flex-col gap-1 w-full relative">
        {/* 
          When expired, always show 100% with red color
          The progressValue will be > 100 when expired, but we limit to 100 for display
          Color changes: red if <= 5 min, orange if <= 10 min, default otherwise
        */}
        <Progress
          value={isExpired ? 100 : Math.min(100, progressValue)}
          variant={progressVariant}
          className="h-10"
          style={{ borderRadius: '0.5rem' }}
        />
        {isTimerActive && (
          <span className={`absolute font-semibold m-2 px-2 bg-card rounded-sm ${isExpired ? 'text-destructive' : 'text-color'}`}>
            {remainingTime} {isExpired ? t('common.expired') : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Quick button to add/start 1 hour */}
        <Button
          variant="outline"
          size="icon"
          onClick={onQuickAdd}
          title={isTimerActive ? t('card.addHour') : t('card.startTimer')}
        >
          <ClockPlus className="h-4 w-4" />
        </Button>

        {/* Button to reset the timer */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClearTimer}
          disabled={!isTimerActive}
          title={t('card.resetTimer')}
        >
          <ClockFading className="h-4 w-4" />
        </Button>

        {editMode && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <X />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('card.delete')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('card.deleteConfirm', { name: cardName })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteCard}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </CardContent>
  );
}

