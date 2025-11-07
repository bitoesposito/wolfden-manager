export interface Section {
  id: number;
  name: string;
}

export interface TimerState {
  startTime: string | null;
  endTime: string | null;
  initialDurationMinutes: number;
  isActive: boolean;
}

export interface UserCard {
  id: number;
  name: string;
  progressValue: number;
  timer?: TimerState;
}

export interface SectionItemProps {
  editMode: boolean;
  sectionName: string;
  onSectionNameChange?: (name: string) => void;
  onAddSection?: () => void;
  onDeleteSection?: () => void;
}

export interface UserCardProps {
  id: number;
  name: string;
  progressValue: number;
  editMode: boolean;
  timer?: TimerState;
  onNameChange?: (name: string) => void;
  onDelete?: () => void;
  onTimerStart?: (durationMinutes: number) => void;
  onTimerAddTime?: (minutes: number) => void;
  onTimerClear?: () => void;
}

export interface HeaderProps {
  editMode: boolean;
  toggleEditMode: () => void;
}

