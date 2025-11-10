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
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { ClockPlus, ClockFading, X } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { parseShiftTooltip } from '@/lib/utils/text-parser';

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
        {isTimerActive ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Progress
                    value={isExpired ? 100 : Math.min(100, progressValue)}
                    variant={progressVariant}
                    className="h-10"
                    style={{ borderRadius: '0.5rem' }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <span>+</span>
                      <span>{t('card.scrollAdjustTime.scroll')}</span>
                    </KbdGroup>
                    <span>= ±1 {t('common.minute')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>Shift</Kbd>
                      <span>+</span>
                      <span>{t('card.scrollAdjustTime.scroll')}</span>
                    </KbdGroup>
                    <span>= ±5 {t('common.minutes')}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Progress
            value={isExpired ? 100 : Math.min(100, progressValue)}
            variant={progressVariant}
            className="h-10"
            style={{ borderRadius: '0.5rem' }}
          />
        )}
        {isTimerActive ? (
          <span className={`absolute select-none font-semibold m-2 px-2 bg-card rounded-sm ${isExpired ? 'text-destructive' : 'text-color'}`}>
            {remainingTime} {isExpired ? t('common.expired') : ''}
          </span>
        ) : (
          <span className="absolute select-none text-sm m-2 my-2.5 rounded-sm text-muted-foreground">
            {t('card.timerAvailable')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="icon"
                onClick={onQuickAdd}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <ClockPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <span>{isTimerActive ? t('card.addHour') : t('card.startTimer')}</span>
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>1</Kbd>
                </KbdGroup>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="icon"
                onClick={onClearTimer}
                onDoubleClick={(e) => e.stopPropagation()}
                disabled={!isTimerActive}
              >
                <ClockFading className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <span>{t('card.resetTimer')}</span>
                {isTimerActive && (
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>R</Kbd>
                  </KbdGroup>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
                        // If Shift is pressed, delete directly without opening dialog
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
                  {parseShiftTooltip(t('card.deleteTooltip'))}
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

