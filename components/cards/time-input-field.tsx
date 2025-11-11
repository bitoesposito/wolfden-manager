/**
 * Reusable time input field component
 * Used in card headers for start/end time inputs
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimeInputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  displayValue?: string;
  mounted: boolean;
  editable: boolean;
  label?: string;
  id?: string;
}

/**
 * Time input field that switches between editable input and display text
 * Includes accessible label for screen readers
 */
export function TimeInputField({
  value,
  onChange,
  onBlur,
  displayValue,
  mounted,
  editable,
  label,
  id,
}: TimeInputFieldProps) {
  const timeInputClassName = "text-sm px-1 m-0 h-fit text-muted-foreground w-fit text-center border-transparent bg-transparent hover:bg-accent/50 focus:bg-accent/50 focus:border-input [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none";
  const timeInputStyle: React.CSSProperties = {
    WebkitAppearance: 'none',
    MozAppearance: 'textfield'
  };

  const inputId = id || `time-input-${Math.random().toString(36).slice(2, 11)}`;

  if (mounted && editable) {
    return (
      <>
        {label && <Label htmlFor={inputId} className="sr-only">{label}</Label>}
        <Input
          id={inputId}
          type="time"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={timeInputClassName}
          style={timeInputStyle}
          aria-label={label}
        />
      </>
    );
  }

  return (
    <span className={`text-sm text-muted-foreground ${displayValue ? 'mr-2' : ''}`} aria-label={label}>
      {displayValue || value}
    </span>
  );
}

