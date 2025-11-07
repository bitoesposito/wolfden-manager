"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Play,
  SkipForward,
  X,
  ClockPlus,
  ClockFading,
  ChevronDown,
} from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { AddTimeDialog } from '@/components/cards/add-time-dialog';
import type { UserCardProps } from '@/types';

export function UserCard({
  name,
  progressValue,
  editMode,
  timer,
  onNameChange,
  onDelete,
  onTimerStart,
  onTimerAddTime,
  onTimerClear,
}: UserCardProps) {
  const [addTimeDialogOpen, setAddTimeDialogOpen] = useState(false);
  const isTimerActive = timer?.isActive ?? false;
  const startTime = timer?.startTime ?? '00:00';
  const endTime = timer?.endTime ?? '00:00';

  const handleStartTimer = (durationMinutes: number) => {
    onTimerStart?.(durationMinutes);
  };

  const handleAddTime = (minutes: number) => {
    onTimerAddTime?.(minutes);
  };

  const handleAddTimeFromDialog = (hours: number, minutes: number) => {
    const totalMinutes = hours * 60 + minutes;
    handleAddTime(totalMinutes);
  };

  return (
    <Card className="p-3 gap-1">
      <CardHeader className="flex px-0 items-center">
        {editMode ? (
          <Input
            value={name}
            onChange={(e) => onNameChange?.(e.target.value)}
            className="text-ellipsis overflow-hidden w-full whitespace-nowrap font-semibold uppercase"
            style={{ marginRight: editMode ? "2.5rem" : "0" }}
            placeholder='Nome postazione'
          />
        ) : (
          <CardTitle className="text-ellipsis overflow-hidden w-full whitespace-nowrap">
            {name}
          </CardTitle>
        )}

        <div className="flex items-center gap-1">
          <Play className="text-muted-foreground" size={16} />
          <span className="text-sm text-muted-foreground mr-2">{startTime}</span>
          <SkipForward className="text-muted-foreground" size={16} />
          <span className="text-sm text-muted-foreground">{endTime}</span>
        </div>
      </CardHeader>

      <CardContent className="px-0 flex gap-2 items-center">
        <Progress value={progressValue} />

        <div className="flex items-center gap-1">
          <ButtonGroup>
            <Button
              variant="outline"
              disabled={isTimerActive}
              onClick={() => !isTimerActive && handleStartTimer(60)}
            >
              <ClockPlus />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="!pl-2" disabled={!isTimerActive}>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="[--radius:1rem]">
                <DropdownMenuItem onClick={() => handleAddTime(30)}>
                  +30 minuti
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddTime(60)}>
                  +1 ora<span className="text-muted-foreground text-xs">(default)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddTime(120)}>
                  +2 ore
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAddTimeDialogOpen(true)}>
                  Altro...
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>

          <Button
            variant="outline"
            onClick={() => onTimerClear?.()}
            disabled={!isTimerActive}
          >
            <ClockFading />
          </Button>

          {editMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <X />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Elimina postazione</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sei sicuro di voler eliminare la postazione "{name}"? Questa azione non può essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>

      <AddTimeDialog
        open={addTimeDialogOpen}
        onOpenChange={setAddTimeDialogOpen}
        onConfirm={handleAddTimeFromDialog}
      />
    </Card>
  );
}

