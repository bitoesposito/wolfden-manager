"use client"

import { useState, useCallback } from 'react';
import type { UserCard } from '@/types';
import { generateNextId } from '@/lib/utils/id';

const INITIAL_CARDS: UserCard[] = [{ id: 1, name: '1', progressValue: 0 }];

export function useUserCards() {
  const [cards, setCards] = useState<UserCard[]>(INITIAL_CARDS);

  const addCard = useCallback(() => {
    setCards((prev) => {
      const newId = generateNextId(prev.map((c) => c.id));
      return [...prev, { id: newId, name: String(newId), progressValue: 0 }];
    });
  }, []);

  const deleteCard = useCallback((id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const updateCardName = useCallback((id: number, name: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, name } : card))
    );
  }, []);

  return {
    cards,
    addCard,
    deleteCard,
    updateCardName,
  };
}

