/**
 * Main user card component
 * Orchestrates all sub-components and hooks
 * Separation of concerns: this component coordinates, doesn't implement
 */

"use client"

import { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { UserCardHeader } from '@/components/cards/user-card-header';
import { UserCardContent } from '@/components/cards/user-card-content';
import { UserCardContextMenu } from '@/components/cards/user-card-context-menu';
import { UserCardDialogs } from '@/components/cards/user-card-dialogs';
import { SwapCardDialog } from '@/components/cards/swap-card-dialog';
import { useTimerCalculations, useCardActions, useCardInteractions } from '@/hooks';
import { useAppStore } from '@/store/app-store';
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
  const [swapCardDialogOpen, setSwapCardDialogOpen] = useState(false);

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

  // Store per scambio postazioni
  const { swapCardTimers, getAllCards } = useAppStore();

  // Verifica se ci sono altre postazioni disponibili per lo scambio
  const canSwapCard = useMemo(() => {
    const allCards = getAllCards();
    return allCards.some(
      (item) => !(item.sectionId === sectionId && item.card.id === id)
    );
  }, [getAllCards, sectionId, id]);

  // Handler per lo scambio postazioni
  const handleSwapCard = useCallback(
    (targetSectionId: number, targetCardId: number) => {
      swapCardTimers(sectionId, id, targetSectionId, targetCardId);
    },
    [swapCardTimers, sectionId, id]
  );

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

  /**
   * Handler per aggiungere/avviare timer con durata specifica
   * Se timer attivo: aggiunge tempo, altrimenti avvia timer
   */
  const handleQuickAdd = useCallback((minutes: number) => {
    if (isTimerActive) {
      handleAddTime(minutes);
    } else {
      handleStartTimer(minutes);
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
    onSwapCard: canSwapCard ? () => setSwapCardDialogOpen(true) : undefined,
    onClearTimer: clearTimer,
    canSwapCard,
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          className="p-3 gap-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
        >
          <UserCardHeader
            name={name}
            editMode={editMode}
            timer={timer}
            onNameChange={updateCardName}
            onTimeChange={isTimerActive ? updateTimerDates : startTimerWithDates}
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
        onSwapCard={() => setSwapCardDialogOpen(true)}
        canSwapCard={canSwapCard}
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
        onStartTimer={handleStartTimer}
        onStartTimerWithDates={startTimerWithDates}
        onUpdateTimerDates={updateTimerDates}
      />

      <SwapCardDialog
        open={swapCardDialogOpen}
        onOpenChange={setSwapCardDialogOpen}
        currentSectionId={sectionId}
        currentCardId={id}
        currentCardName={name}
        onConfirm={handleSwapCard}
      />
    </ContextMenu>
  );
}
