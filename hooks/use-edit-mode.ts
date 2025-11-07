"use client"

import { useState, useCallback } from 'react';

export function useEditMode() {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  return {
    editMode,
    toggleEditMode,
  };
}

