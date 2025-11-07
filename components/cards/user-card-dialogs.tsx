/**
 * Component for all user card dialogs
 * Centralizes the management of AddTimeDialog and DetailsDialog
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AddTimeDialog } from '@/components/cards/add-time-dialog';
import { toTotalMinutes } from '@/lib/utils/time';
import { Calendar, Clock, Timer, AlertCircle } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { TimerState } from '@/types';

dayjs.extend(utc);
dayjs.extend(timezone);

interface UserCardDialogsProps {
  addTimeDialogOpen: boolean;
  detailsDialogOpen: boolean;
  isTimerActive: boolean;
  timer?: TimerState;
  remainingTime: string;
  isExpired: boolean;
  onAddTimeDialogChange: (open: boolean) => void;
  onDetailsDialogChange: (open: boolean) => void;
  onAddTime: (minutes: number) => void;
  onStartTimerWithDates: (startTime: string, endTime: string) => void;
  onUpdateTimerDates: (startTime: string, endTime: string) => void;
}

/**
 * Wrapper for all card dialogs
 * Receives dialog state as props for external control
 */
export function UserCardDialogs({
  addTimeDialogOpen,
  detailsDialogOpen,
  isTimerActive,
  timer,
  remainingTime,
  isExpired,
  onAddTimeDialogChange,
  onDetailsDialogChange,
  onAddTime,
  onStartTimerWithDates,
  onUpdateTimerDates,
}: UserCardDialogsProps) {
  const { t } = useI18n();

  /**
   * Handles adding time via custom dialog
   * Converts hours and minutes to total minutes
   */
  const handleAddTimeFromDialog = (hours: number, minutes: number) => {
    const totalMinutes = toTotalMinutes(hours, minutes);
    onAddTime(totalMinutes);
  };

  /**
   * Handles starting timer with specific dates/times
   * If the timer is already active, updates the dates instead of starting a new one
   */
  const handleStartTimerWithDates = (startTime: string, endTime: string) => {
    if (isTimerActive) {
      onUpdateTimerDates(startTime, endTime);
    } else {
      onStartTimerWithDates(startTime, endTime);
    }
  };

  return (
    <>
      <AddTimeDialog
        open={addTimeDialogOpen}
        onOpenChange={onAddTimeDialogChange}
        onConfirm={handleAddTimeFromDialog}
        onConfirmWithDates={handleStartTimerWithDates}
        isTimerActive={isTimerActive}
        currentStartTime={timer?.startTime ?? null}
        currentEndTime={timer?.endTime ?? null}
      />

      {/* Timer details dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={onDetailsDialogChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              {t('timerDetails.title')}
            </DialogTitle>
            <DialogDescription>
              {t('timerDetails.description')}
            </DialogDescription>
          </DialogHeader>
          {timer && timer.isActive && (
            <div className="grid gap-6 py-4">
              {/* Status Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {t('timerDetails.sections.status')}
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('timerDetails.fields.remainingTime')}</span>
                    <span className={`text-lg font-semibold ${isExpired ? 'text-destructive' : 'text-foreground'}`}>
                      {remainingTime}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${isExpired ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      {isExpired ? t('common.expired') : t('common.active')}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Time Range Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('timerDetails.sections.period')}
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{t('timerDetails.fields.startDateTime')}</div>
                      <div className="text-sm font-medium">
                        {timer.startTime
                          ? dayjs(timer.startTime).tz('Europe/Rome').format('DD/MM/YYYY HH:mm')
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{t('timerDetails.fields.endDateTime')}</div>
                      <div className="text-sm font-medium">
                        {timer.endTime
                          ? dayjs(timer.endTime).tz('Europe/Rome').format('DD/MM/YYYY HH:mm')
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Duration Section */}
              {timer.startTime && timer.endTime && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('timerDetails.sections.durations')}
                  </h3>
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="text-xs text-muted-foreground mb-1">{t('timerDetails.fields.totalDuration')}</div>
                    <div className="text-base font-semibold">
                      {dayjs(timer.endTime).diff(dayjs(timer.startTime), 'minute')} {t('common.min')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

