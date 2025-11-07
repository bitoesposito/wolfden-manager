"use client"

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
import type { UserCardProps } from '@/types';

export function UserCard({
  name,
  progressValue,
  editMode,
  onNameChange,
  onDelete,
}: UserCardProps) {
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
          <span className="text-sm text-muted-foreground mr-2">00:00</span>
          <SkipForward className="text-muted-foreground" size={16} />
          <span className="text-sm text-muted-foreground">00:00</span>
        </div>
      </CardHeader>

      <CardContent className="px-0 flex gap-2 items-center">
        <Progress value={progressValue} />

        <div className="flex items-center gap-1">
          <ButtonGroup>
            <Button variant="outline">
              <ClockPlus />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="!pl-2">
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="[--radius:1rem]">
                <DropdownMenuItem>+30 minuti</DropdownMenuItem>
                <DropdownMenuItem>
                  +1 ora<span className="text-muted-foreground text-xs">(default)</span>
                </DropdownMenuItem>
                <DropdownMenuItem>+2 ore</DropdownMenuItem>
                <DropdownMenuItem>Altro...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>

          <Button variant="outline">
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
    </Card>
  );
}

