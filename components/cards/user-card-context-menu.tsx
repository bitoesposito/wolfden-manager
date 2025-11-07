/**
 * Component for the user card context menu
 * Handles all context menu options based on timer state
 */

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import {
  Play,
  ClockPlus,
  Clock,
  ClockAlert,
  Plus,
  ClockFading,
  Trash2,
  MoreHorizontal,
  Timer,
  Info,
} from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

interface UserCardContextMenuProps {
  isTimerActive: boolean;
  editMode: boolean;
  onStartTimer: (durationMinutes: number) => void;
  onAddTime: (minutes: number) => void;
  onOpenCustomDialog: () => void;
  onOpenDetailsDialog: () => void;
  onClearTimer: () => void;
  onDeleteCard: () => void;
}

/**
 * Context menu with all available actions on the card
 * Changes dynamically based on timer state and edit mode
 */
export function UserCardContextMenu({
  isTimerActive,
  editMode,
  onStartTimer,
  onAddTime,
  onOpenCustomDialog,
  onOpenDetailsDialog,
  onClearTimer,
  onDeleteCard,
}: UserCardContextMenuProps) {
  const { t } = useI18n();

  return (
    <ContextMenuContent className="w-56">
      {/* Timer actions - different based on active state */}
      {!isTimerActive ? (
        <>
          {/* Start timer - main quick actions */}
          <ContextMenuItem onClick={() => onStartTimer(60)}>
            <Play className="h-4 w-4" />
            <span>{t('contextMenu.startTimer.oneHour')}</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Sub-menu for quick durations */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Timer className="h-4 w-4 mr-2" />
              <span>{t('contextMenu.startTimer.quickStart')}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onStartTimer(30)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.startTimer.durations.30min')}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onStartTimer(60)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.startTimer.durations.1hour')}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>1</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onStartTimer(120)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.startTimer.durations.2hours')}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>2</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Custom duration */}
          <ContextMenuItem onClick={onOpenCustomDialog}>
            <MoreHorizontal className="h-4 w-4" />
            <span>{t('contextMenu.startTimer.custom')}</span>
          </ContextMenuItem>
        </>
      ) : (
        <>
          {/* Main quick actions when timer is active */}
          <ContextMenuItem onClick={() => onAddTime(60)}>
            <Plus className="h-4 w-4" />
            <span>{t('contextMenu.timerActive.addOneHour')}</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Sub-menu to add time */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ClockPlus className="h-4 w-4 mr-2" />
              <span>{t('contextMenu.timerActive.addTime')}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onAddTime(30)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.timerActive.durations.30min')}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(60)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.timerActive.durations.1hour')}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>1</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(120)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.timerActive.durations.2hours')}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>2</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Sub-menu to remove time */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ClockAlert className="h-4 w-4 mr-2" />
              <span>{t('contextMenu.timerActive.removeTime')}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onAddTime(-30)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.timerActive.durations.30min')}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(-60)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.timerActive.durations.1hour')}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(-120)}>
                <Clock className="h-4 w-4" />
                <span>{t('contextMenu.timerActive.durations.2hours')}</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Custom time */}
          <ContextMenuItem onClick={onOpenCustomDialog}>
            <MoreHorizontal className="h-4 w-4" />
            <span>{t('contextMenu.timerActive.customTime')}</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Timer details */}
          <ContextMenuItem onClick={onOpenDetailsDialog}>
            <Info className="h-4 w-4" />
            <span>{t('contextMenu.timerActive.details')}</span>
          </ContextMenuItem>

          {/* Reset timer */}
          <ContextMenuItem onClick={onClearTimer}>
            <ClockFading className="h-4 w-4" />
            <span>{t('contextMenu.timerActive.reset')}</span>
          </ContextMenuItem>
        </>
      )}

      {/* Edit mode actions */}
      {editMode && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={onDeleteCard}>
            <Trash2 className="h-4 w-4" />
            <span>{t('card.delete')}</span>
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  );
}

