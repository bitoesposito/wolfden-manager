export interface Section {
  id: number;
  name: string;
}

export interface UserCard {
  id: number;
  name: string;
  progressValue: number;
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
  onNameChange?: (name: string) => void;
  onDelete?: () => void;
}

export interface HeaderProps {
  editMode: boolean;
  toggleEditMode: () => void;
}

