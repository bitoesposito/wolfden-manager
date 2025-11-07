/**
 * Section Service
 * Business logic for section management
 */

import type { Section } from '@/types';
import { generateNextId } from '@/lib/utils/id';

/**
 * Creates a new section
 */
export function createSection(existingSections: Section[]): Section {
  const newId = generateNextId(existingSections.map((s) => s.id));
  return {
    id: newId,
    name: 'Section name',
  };
}

/**
 * Updates a section's name
 */
export function updateSectionName(
  sections: Section[],
  sectionId: number,
  name: string
): Section[] {
  return sections.map((section) =>
    section.id === sectionId ? { ...section, name } : section
  );
}

/**
 * Deletes a section
 */
export function deleteSection(sections: Section[], sectionId: number): Section[] {
  return sections.filter((section) => section.id !== sectionId);
}

