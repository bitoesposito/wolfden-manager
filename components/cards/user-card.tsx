/**
 * Main user card component
 * Orchestrates all sub-components and hooks
 * Separation of concerns: this component coordinates, doesn't implement
 */

"use client"

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { UserCardHeader } from '@/components/cards/user-card-header';
import { UserCardContent } from '@/components/cards/user-card-content';
import { UserCardContextMenu } from '@/components/cards/user-card-context-menu';
import { UserCardDialogs } from '@/components/cards/user-card-dialogs';
import { useTimerCalculations, useCardActions, useCardInteractions } from '@/hooks';
import type { UserCardProps } from '@/types';

/**
 * Main card for managing a user's timer
 * Uses separate components for header, content, context menu, and dialogs
 * Uses dedicated hooks for business logic and interactions
 */
export function UserCard({
  sectionId,
  id,
  name,
  progressValue,
  editMode,
  timer,
}: UserCardProps) {
  // Local state only for dialogs
  const [addTimeDialogOpen, setAddTimeDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Hook for card actions (business logic)
  const {
    updateCardName,
    deleteCard,
    startTimer,
    startTimerWithDates,
    updateTimerDates,
    addTimeToTimer,
    clearTimer,
  } = useCardActions(sectionId, id);

  // Hook for timer calculations (presentation logic)
  const { remainingTime, isExpired, progressVariant } = useTimerCalculations(timer);

  const isTimerActive = timer?.isActive ?? false;

  // Handlers for timer actions
  const handleStartTimer = useCallback((durationMinutes: number) => {
    startTimer(durationMinutes);
  }, [startTimer]);

  const handleAddTime = useCallback((minutes: number) => {
    addTimeToTimer(minutes);
  }, [addTimeToTimer]);

  const handleQuickAdd = useCallback(() => {
    if (isTimerActive) {
      handleAddTime(60);
    } else {
      handleStartTimer(60);
    }
  }, [isTimerActive, handleAddTime, handleStartTimer]);

  // Hook for interactions (hover, keyboard shortcuts, double click)
  const {
    handleDoubleClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useCardInteractions({
    isTimerActive,
    onStartTimer: handleStartTimer,
    onAddTime: handleAddTime,
    onOpenCustomDialog: () => setAddTimeDialogOpen(true),
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          className="p-3 gap-1 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
        >
          <UserCardHeader
            name={name}
            editMode={editMode}
            timer={timer}
            onNameChange={updateCardName}
          />

          <UserCardContent
            progressValue={progressValue}
            isExpired={isExpired}
            progressVariant={progressVariant}
            remainingTime={remainingTime}
            isTimerActive={isTimerActive}
            editMode={editMode}
            cardName={name}
            onQuickAdd={handleQuickAdd}
            onClearTimer={clearTimer}
            onDeleteCard={deleteCard}
          />
        </Card>
      </ContextMenuTrigger>

      <UserCardContextMenu
        isTimerActive={isTimerActive}
        editMode={editMode}
        onStartTimer={handleStartTimer}
        onAddTime={handleAddTime}
        onOpenCustomDialog={() => setAddTimeDialogOpen(true)}
        onOpenDetailsDialog={() => setDetailsDialogOpen(true)}
        onClearTimer={clearTimer}
        onDeleteCard={deleteCard}
      />

      <UserCardDialogs
        addTimeDialogOpen={addTimeDialogOpen}
        detailsDialogOpen={detailsDialogOpen}
        isTimerActive={isTimerActive}
        timer={timer}
        remainingTime={remainingTime}
        isExpired={isExpired}
        onAddTimeDialogChange={setAddTimeDialogOpen}
        onDetailsDialogChange={setDetailsDialogOpen}
        onAddTime={handleAddTime}
        onStartTimerWithDates={startTimerWithDates}
        onUpdateTimerDates={updateTimerDates}
      />
    </ContextMenu>
  );
}
