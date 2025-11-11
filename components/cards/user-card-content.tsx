/**
 * Component for the user card content
 * Handles the progress bar, quick action buttons, and delete button
 */

import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ClockPlus, ClockFading, X } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { parseShiftTooltip } from "@/lib/utils/text-parser";

interface UserCardContentProps {
  progressValue: number;
  isExpired: boolean;
  progressVariant: "default" | "warning" | "orange" | "destructive" | undefined;
  remainingTime: string;
  isTimerActive: boolean;
  editMode: boolean;
  cardName: string;
  onQuickAdd: (minutes: number) => void;
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
                    className="h-9"
                    style={{ borderRadius: "0.5rem" }}
                    aria-label={t("card.progressLabel", { name: cardName })}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-2">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Progress
            value={isExpired ? 100 : Math.min(100, progressValue)}
            variant={progressVariant}
            className="h-9"
            style={{ borderRadius: "0.5rem" }}
            aria-label={t("card.progressLabel", { name: cardName })}
          />
        )}
        {isTimerActive ? (
          <span
            className={`absolute select-none font-semibold m-1.5 px-2 bg-card rounded-sm ${
              isExpired ? "text-destructive" : "text-color"
            }`}
          >
            {remainingTime} {isExpired ? t("common.expired") : ""}
          </span>
        ) : (
          <TooltipProvider>
            <div className="absolute flex m-0.5 gap-1">
              {/* Pulsante 30 minuti - Ctrl+3 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQuickAdd(30)}
                    aria-label={t("addTimeDialog.quickValues.plus30min")}
                    className="cursor-pointer"
                  >
                    <ClockPlus className="h-4 w-4" />
                    <span className="text-sm text-foreground/70 font-normal">
                      {t("contextMenu.timerActive.durations.30min")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-2">
                    <span>{t("addTimeDialog.quickValues.plus30min")}</span>
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>3</Kbd>
                    </KbdGroup>
                  </div>
                </TooltipContent>
              </Tooltip>

              {/* Pulsante 1 ora - Ctrl+1 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQuickAdd(60)}
                    aria-label={t("addTimeDialog.quickValues.plus1hour")}
                    className="cursor-pointer"
                  >
                    <ClockPlus className="h-4 w-4" />
                    <span className="text-sm text-foreground/70 font-normal">
                      {t("contextMenu.timerActive.durations.1hour")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-2">
                    <span>{t("addTimeDialog.quickValues.plus1hour")}</span>
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>1</Kbd>
                    </KbdGroup>
                  </div>
                </TooltipContent>
              </Tooltip>

              {/* Pulsante 2 ore - Ctrl+2 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQuickAdd(120)}
                    aria-label={t("addTimeDialog.quickValues.plus2hours")}
                    className="cursor-pointer"
                  >
                    <ClockPlus className="h-4 w-4" />
                    <span className="text-sm text-foreground/70 font-normal">
                      {t("contextMenu.timerActive.durations.2hours")}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-2">
                    <span>{t("addTimeDialog.quickValues.plus2hours")}</span>
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>2</Kbd>
                    </KbdGroup>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Pulsante reset timer - Ctrl+R (solo quando timer attivo) */}
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
                aria-label={t("card.resetTimer")}
              >
                <ClockFading className="h-4 w-4" />
                <span className="sr-only">{t("card.resetTimer")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <span>{t("card.resetTimer")}</span>
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
                      aria-label={t("card.delete")}
                    >
                      <X />
                      <span className="sr-only">{t("card.delete")}</span>
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  {parseShiftTooltip(t("card.deleteTooltip"))}
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("card.delete")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("card.deleteConfirm", { name: cardName })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteCard}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("common.delete")}
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
