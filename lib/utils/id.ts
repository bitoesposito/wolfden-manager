/**
 * Utility functions for ID generation and management
 */

/**
 * Generates a new unique ID based on existing IDs
 */
export function generateNextId(existingIds: number[]): number {
  if (existingIds.length === 0) return 1;
  return Math.max(...existingIds) + 1;
}

