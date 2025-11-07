/**
 * Card Service
 * Business logic for card management
 */

import type { UserCard } from '@/types';
import { generateNextId } from '@/lib/utils/id';

/**
 * Creates a new card
 */
export function createCard(existingCards: UserCard[]): UserCard {
  const newId = generateNextId(existingCards.map((c) => c.id));
  return {
    id: newId,
    name: String(newId),
    progressValue: 0,
  };
}

/**
 * Updates a card's name
 */
export function updateCardName(cards: UserCard[], cardId: number, name: string): UserCard[] {
  return cards.map((card) => (card.id === cardId ? { ...card, name } : card));
}

/**
 * Deletes a card
 */
export function deleteCard(cards: UserCard[], cardId: number): UserCard[] {
  return cards.filter((card) => card.id !== cardId);
}

/**
 * Finds a card by ID
 */
export function findCardById(cards: UserCard[], cardId: number): UserCard | undefined {
  return cards.find((card) => card.id === cardId);
}

