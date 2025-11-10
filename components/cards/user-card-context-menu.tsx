/**
 * Component for the user card context menu
 * Handles all context menu options based on timer state
 */

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  ClockPlus,
  Clock,
  ClockAlert,
  Plus,
  Minus,
  ClockFading,
  Trash2,
  MoreHorizontal,
  Timer,
  Info,
  ArrowLeftRight,
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface UserCardContextMenuProps {
  isTimerActive: boolean;
  editMode: boolean;
  onStartTimer: (durationMinutes: number) => void;
  onAddTime: (minutes: number) => void;
  onOpenCustomDialog: () => void;
  onOpenDetailsDialog: () => void;
  onClearTimer: () => void;
  onDeleteCard: () => void;
  onSwapCard: () => void;
  canSwapCard?: boolean;
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
  onSwapCard,
  canSwapCard = false,
}: UserCardContextMenuProps) {
  const { t } = useI18n();

  return (
    <ContextMenuContent className="w-56">
      {/* Timer actions - different based on active state */}
      {!isTimerActive ? (
        <>
          {/* Primary action: Start timer */}
          <ContextMenuItem onClick={() => onStartTimer(60)}>
            <Play className="h-4 w-4" />
            <span>{t("contextMenu.startTimer.oneHour")}</span>
            <ContextMenuShortcut>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>1</Kbd>
              </KbdGroup>
            </ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Quick start durations */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Timer className="h-4 w-4 mr-2" />
              <span>{t("contextMenu.startTimer.quickStart")}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onStartTimer(30)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.startTimer.durations.30min")}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>3</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onStartTimer(60)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.startTimer.durations.1hour")}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>1</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onStartTimer(120)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.startTimer.durations.2hours")}</span>
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
            <span>{t("contextMenu.startTimer.custom")}</span>
          </ContextMenuItem>
        </>
      ) : (
        <>
          {/* Quick actions: Add 1 hour, Swap card, Reset timer */}
          <TooltipProvider>
            <div className="grid grid-cols-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <ContextMenuItem
                    onClick={() => onAddTime(60)}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <ClockPlus className="h-4 w-4" />
                    <ContextMenuShortcut>
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <Kbd>1</Kbd>
                      </KbdGroup>
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("contextMenu.timerActive.addOneHour")}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ContextMenuItem
                    onClick={onSwapCard}
                    disabled={!canSwapCard}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    <ContextMenuShortcut>
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <Kbd>S</Kbd>
                      </KbdGroup>
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("contextMenu.timerActive.swapCard")}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ContextMenuItem
                    onClick={onClearTimer}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <ClockFading className="h-4 w-4" />
                    <ContextMenuShortcut>
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <Kbd>R</Kbd>
                      </KbdGroup>
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("contextMenu.timerActive.reset")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <ContextMenuSeparator />

          {/* Add time submenu */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ClockPlus className="h-4 w-4 mr-2" />
              <span>{t("contextMenu.timerActive.addTime")}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onAddTime(30)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.30min")}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>3</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(60)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.1hour")}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>1</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(120)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.2hours")}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>2</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Remove time submenu */}
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ClockAlert className="h-4 w-4 mr-2" />
              <span>{t("contextMenu.timerActive.removeTime")}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => onAddTime(-5)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.5min")}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(-10)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.10min")}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(-15)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.15min")}</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(-30)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.30min")}</span>
                <ContextMenuShortcut>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>3</Kbd>
                  </KbdGroup>
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onAddTime(-60)}>
                <Clock className="h-4 w-4" />
                <span>{t("contextMenu.timerActive.durations.1hour")}</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          {/* Custom time */}
          <ContextMenuItem onClick={onOpenCustomDialog}>
            <MoreHorizontal className="h-4 w-4" />
            <span>{t("contextMenu.timerActive.customTime")}</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Timer information */}
          <ContextMenuItem onClick={onOpenDetailsDialog}>
            <Info className="h-4 w-4" />
            <span>{t("contextMenu.timerActive.details")}</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          {/* Scroll shortcut info */}
          <ContextMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 select-none">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <span>+</span>
                  <span>{t("card.scrollAdjustTime.scroll")}</span>
                </KbdGroup>
                <span>= ±1 {t("common.minute")}</span>
              </div>
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>Ctrl</Kbd>
                  <Kbd>Shift</Kbd>
                  <span>+</span>
                  <span>{t("card.scrollAdjustTime.scroll")}</span>
                </KbdGroup>
                <span>= ±5 {t("common.minutes")}</span>
              </div>
            </div>
          </ContextMenuLabel>
        </>
      )}

      {/* Edit mode actions */}
      {editMode && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={onDeleteCard}>
            <Trash2 className="h-4 w-4" />
            <span>{t("card.delete")}</span>
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  );
}
