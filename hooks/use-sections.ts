"use client"

import { useState, useCallback } from 'react';
import type { Section } from '@/types';
import { generateNextId } from '@/lib/utils/id';

const INITIAL_SECTIONS: Section[] = [{ id: 1, name: 'Section name' }];

export function useSections() {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);

  const addSection = useCallback(() => {
    setSections((prev) => {
      const newId = generateNextId(prev.map((s) => s.id));
      return [...prev, { id: newId, name: 'Section name' }];
    });
  }, []);

  const deleteSection = useCallback((id: number) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  }, []);

  const updateSectionName = useCallback((id: number, name: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, name } : section))
    );
  }, []);

  return {
    sections,
    addSection,
    deleteSection,
    updateSectionName,
  };
}

