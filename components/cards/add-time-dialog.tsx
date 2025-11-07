"use client"

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { normalizeTime, toTotalMinutes, getCurrentTimestamp } from '@/lib/utils/time';
import { toast } from 'sonner';
import { useI18n } from '@/hooks/use-i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface AddTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (hours: number, minutes: number) => void;
  onConfirmWithDates?: (startTime: string, endTime: string) => void; // ISO timestamps
  isTimerActive?: boolean; // If false, disables negative values (timer not yet started)
  onStartTimer?: (durationMinutes: number) => void; // Callback per avviare il timer quando non è attivo
  currentStartTime?: string | null; // ISO timestamp - to initialize fields when editing an existing timer
  currentEndTime?: string | null; // ISO timestamp - to initialize fields when editing an existing timer
}

// Quick values structure (labels will be translated in component)
const QUICK_VALUES_STRUCTURE = [
  { key: 'plus15min', field: 'minutes' as const, value: 15 },
  { key: 'plus30min', field: 'minutes' as const, value: 30 },
  { key: 'plus1hour', field: 'hours' as const, value: 1 },
  { key: 'plus2hours', field: 'hours' as const, value: 2 },
  { key: 'minus15min', field: 'minutes' as const, value: -15 },
  { key: 'minus30min', field: 'minutes' as const, value: -30 },
  { key: 'minus1hour', field: 'hours' as const, value: -1 },
  { key: 'minus2hours', field: 'hours' as const, value: -2 },
] as const;

type TimeField = 'hours' | 'minutes';

/**
 * Helper to convert string to number (default 0 if empty/invalid)
 */
const parseTimeValue = (value: string): number => {
  return parseInt(value, 10) || 0;
};

/**
 * Helper to convert number to string (empty if 0)
 */
const formatTimeValue = (value: number): string => {
  return value !== 0 ? String(value) : '';
};

/**
 * Reusable component for hours/minutes input with +/- controls
 */
interface TimeInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  placeholder: string;
  min?: string;
  max?: string;
  allowNegative?: boolean; // If false, disables the decrement button
}

function TimeInput({
  id,
  label,
  value,
  onChange,
  onIncrement,
  onDecrement,
  placeholder,
  min,
  max,
  allowNegative = true,
}: TimeInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onDecrement}
          className="h-9 w-9 shrink-0"
          disabled={!allowNegative}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            // If negative values are not allowed, block negative input
            if (!allowNegative && newValue.startsWith('-')) {
              return;
            }
            onChange(newValue);
          }}
          placeholder={placeholder}
          className="text-center"
          min={allowNegative ? min : '0'}
          max={max}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onIncrement}
          className="h-9 w-9 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AddTimeDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  onConfirmWithDates,
  isTimerActive = false,
  onStartTimer,
  currentStartTime,
  currentEndTime,
}: AddTimeDialogProps) {
  const { t } = useI18n();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [mode, setMode] = useState<'duration' | 'dates'>('duration');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Calculate total in minutes for validation
  const totalMinutes = useMemo(() => {
    const h = parseTimeValue(hours);
    const m = parseTimeValue(minutes);
    return toTotalMinutes(h, m);
  }, [hours, minutes]);

  // Quick values with translated labels
  const quickValues = useMemo(() => {
    return QUICK_VALUES_STRUCTURE.map((item) => ({
      ...item,
      label: t(`addTimeDialog.quickValues.${item.key}`),
    }));
  }, [t]);

  /**
   * Resets both fields
   */
  const resetFields = useCallback(() => {
    setHours('');
    setMinutes('');
  }, []);

  /**
   * Sets normalized values (handles carry-over for minutes)
   */
  const setNormalizedTime = useCallback((h: number, m: number) => {
    const normalized = normalizeTime(h, m);
    setHours(formatTimeValue(normalized.hours));
    setMinutes(formatTimeValue(normalized.minutes));
  }, []);

  /**
   * Quick value handler: replaces the value in the specified field and resets the other
   * Each click on a quick toggle completely replaces the previous value
   */
  const handleQuickValue = useCallback((field: TimeField, value: number) => {
    resetFields();
    if (field === 'hours') {
      setHours(String(value));
    } else {
      setMinutes(String(value));
    }
  }, [resetFields]);

  /**
   * Increments/decrements hours (simple, without carry-over)
   */
  const adjustHours = useCallback((delta: number) => {
    const h = parseTimeValue(hours);
    setHours(formatTimeValue(h + delta));
  }, [hours]);

  /**
   * Increments/decrements minutes (with automatic carry-over)
   */
  const adjustMinutes = useCallback((delta: number) => {
    const h = parseTimeValue(hours);
    const m = parseTimeValue(minutes);
    setNormalizedTime(h, m + delta);
  }, [hours, minutes, setNormalizedTime]);

  /**
   * Resets all fields when the dialog closes
   */
  useEffect(() => {
    if (!open) {
      resetFields();
      setMode('duration');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
    }
  }, [open, resetFields]);

  /**
   * Initializes date/time fields with current values or existing timer values when switching to dates mode
   */
  useEffect(() => {
    if (mode === 'dates' && open) {
      if (isTimerActive && currentStartTime && currentEndTime) {
        // Use existing timer values
        const start = dayjs(currentStartTime).tz('Europe/Rome');
        const end = dayjs(currentEndTime).tz('Europe/Rome');
        setStartDate(start.format('YYYY-MM-DD'));
        setStartTime(start.format('HH:mm'));
        setEndDate(end.format('YYYY-MM-DD'));
        setEndTime(end.format('HH:mm'));
      } else {
        // Use current values
        const now = dayjs().tz('Europe/Rome');
        setStartDate(now.format('YYYY-MM-DD'));
        setStartTime(now.format('HH:mm'));
        setEndDate(now.format('YYYY-MM-DD'));
        setEndTime(now.add(1, 'hour').format('HH:mm'));
      }
    }
  }, [mode, open, isTimerActive, currentStartTime, currentEndTime]);

  const handleConfirm = useCallback(() => {
    if (mode === 'duration') {
      const h = parseTimeValue(hours);
      const m = parseTimeValue(minutes);

      // Se il timer non è attivo e il valore è negativo, mostra un avviso
      if (!isTimerActive && totalMinutes < 0) {
        toast.error(t('addTimeDialog.errors.cannotSubtractWhenInactive'), {
          description: t('addTimeDialog.errors.cannotSubtractWhenInactiveDescription'),
        });
        return;
      }

      if (totalMinutes !== 0) {
        onConfirm(h, m);
        resetFields();
        onOpenChange(false);
      }
    } else {
      // Date/time mode
      if (!startDate || !startTime || !endDate || !endTime || !onConfirmWithDates) {
        return;
      }

      try {
        // Create timestamps with correct format
        const start = dayjs.tz(`${startDate}T${startTime}`, 'YYYY-MM-DDTHH:mm', 'Europe/Rome');
        const end = dayjs.tz(`${endDate}T${endTime}`, 'YYYY-MM-DDTHH:mm', 'Europe/Rome');

        // Verify that dates are valid
        if (!start.isValid() || !end.isValid()) {
          toast.error(t('addTimeDialog.errors.invalidDates'), {
            description: t('addTimeDialog.errors.invalidDatesDescription'),
          });
          return;
        }

        if (end.isBefore(start)) {
          toast.error(t('addTimeDialog.errors.invalidDateTime'), {
            description: t('addTimeDialog.errors.invalidDateTimeDescription'),
          });
          return;
        }

        onConfirmWithDates(start.toISOString(), end.toISOString());
        toast.success(isTimerActive ? t('addTimeDialog.success.timerUpdated') : t('addTimeDialog.success.timerStarted'), {
          description: t('addTimeDialog.success.timerRange', {
            start: start.format('DD/MM/YYYY HH:mm'),
            end: end.format('DD/MM/YYYY HH:mm'),
          }),
        });
        onOpenChange(false);
      } catch (error) {
        console.error('Errore nella conversione date:', error);
        toast.error(t('addTimeDialog.errors.conversionError'), {
          description: t('addTimeDialog.errors.conversionErrorDescription'),
        });
      }
    }
  }, [mode, hours, minutes, totalMinutes, isTimerActive, startDate, startTime, endDate, endTime, onConfirm, onConfirmWithDates, resetFields, onOpenChange, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addTimeDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('addTimeDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Toggle between duration and date modes */}
          <div className="flex gap-2 border-b">
            <Button
              type="button"
              variant={mode === 'duration' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('duration')}
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              {t('addTimeDialog.modes.duration')}
            </Button>
            <Button
              type="button"
              variant={mode === 'dates' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('dates')}
              className="flex-1"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t('addTimeDialog.modes.dates')}
            </Button>
          </div>

          {mode === 'duration' ? (
            <div className="grid gap-6">
              {/* Quick action buttons */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium">{t('addTimeDialog.quickChoices')}</Label>
                <div className="grid grid-cols-4 gap-2">
              {quickValues.map((value, index) => {
                // I valori negativi sono sempre abilitati, ma mostreranno un avviso se il timer non è attivo
                return (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickValue(value.field, value.value)}
                    className="text-xs"
                  >
                    {value.label}
                  </Button>
                );
              })}
                </div>
              </div>

              {/* Manual input with +/- controls */}
              <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <TimeInput
                id="hours"
                label={t('addTimeDialog.labels.hours')}
                value={hours}
                onChange={setHours}
                onIncrement={() => adjustHours(1)}
                onDecrement={() => adjustHours(-1)}
                placeholder={t('addTimeDialog.labels.hoursPlaceholder')}
                allowNegative={true}
              />
              <TimeInput
                id="minutes"
                label={t('addTimeDialog.labels.minutes')}
                value={minutes}
                onChange={setMinutes}
                onIncrement={() => adjustMinutes(1)}
                onDecrement={() => adjustMinutes(-1)}
                placeholder={t('addTimeDialog.labels.minutesPlaceholder')}
                min="-59"
                max="59"
                allowNegative={true}
              />
              </div>
            </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Data e ora di inizio */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium">{t('addTimeDialog.labels.startDateTime')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date" className="text-xs text-muted-foreground">{t('addTimeDialog.labels.date')}</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="start-time" className="text-xs text-muted-foreground">{t('addTimeDialog.labels.time')}</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Data e ora di fine */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium">{t('addTimeDialog.labels.endDateTime')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="end-date" className="text-xs text-muted-foreground">{t('addTimeDialog.labels.date')}</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-time" className="text-xs text-muted-foreground">{t('addTimeDialog.labels.time')}</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={
              mode === 'duration' 
                ? totalMinutes === 0 
                : !startDate || !startTime || !endDate || !endTime || !onConfirmWithDates
            }
          >
            {t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

