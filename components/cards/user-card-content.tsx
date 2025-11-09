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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';
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
        <Button
          variant="outline"
          size="icon"
          onClick={onQuickAdd}
          onDoubleClick={(e) => e.stopPropagation()}
          title={isTimerActive ? t('card.addHour') : t('card.startTimer')}
        >
          <ClockPlus className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onClearTimer}
          onDoubleClick={(e) => e.stopPropagation()}
          disabled={!isTimerActive}
          title={t('card.resetTimer')}
        >
          <ClockFading className="h-4 w-4" />
        </Button>

        {editMode && (
          <TooltipProvider>
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      onDoubleClick={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        // Se Shift è premuto, elimina direttamente senza aprire il dialog
                        if (e.shiftKey) {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteCard();
                        }
                      }}
                    >
                      <X />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  {(() => {
                    const text = t('card.deleteTooltip');
                    const parts = text.split('{shift}');
                    return parts.map((part, index) => (
                      <span key={index}>
                        {part}
                        {index < parts.length - 1 && (
                          <Kbd className="inline-flex items-center gap-1 mx-0.5">
                            Shift
                          </Kbd>
                        )}
                      </span>
                    ));
                  })()}
                </TooltipContent>
              </Tooltip>
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
          </TooltipProvider>
        )}
      </div>
    </CardContent>
  );
}

