export interface Section {
  id: number;
  name: string;
}

export interface TimerState {
  // Timestamp ISO completi per gestire correttamente date e ore
  startTime: string | null; // ISO timestamp (es. "2024-01-15T14:30:00+01:00")
  endTime: string | null;   // ISO timestamp (es. "2024-01-15T15:30:00+01:00")
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
  sectionId: number;
  sectionName: string;
  onSectionNameChange?: (name: string) => void;
  onAddSection?: () => void;
  onDeleteSection?: () => void;
}

export interface UserCardProps {
  sectionId: number;
  id: number;
  name: string;
  progressValue: number;
  editMode: boolean;
  timer?: TimerState;
}

export interface HeaderProps {
  editMode: boolean;
  toggleEditMode: () => void;
}

