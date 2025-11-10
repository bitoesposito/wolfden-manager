"use client";

import { useState, useEffect } from 'react';
import {
  isAudioMuted,
  muteAudio,
  unmuteAudio,
  initAudioState,
} from '@/lib/utils/sound';

/**
 * Hook to manage audio mute/unmute state
 * Synchronizes state with localStorage and handles browser permissions
 */
export function useAudio() {
  const [muted, setMuted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state on mount
  useEffect(() => {
    initAudioState();
    setMuted(isAudioMuted());
    setIsInitialized(true);
  }, []);

  /**
   * Mutes audio
   */
  const mute = () => {
    muteAudio();
    setMuted(true);
  };

  /**
   * Unmutes audio and requests browser permissions if needed
   */
  const unmute = async () => {
    const success = await unmuteAudio();
    // Always set as unmuted - if unlock failed, user will need to interact with page
    // but we still update the UI state to reflect user's intent
    setMuted(false);
  };

  /**
   * Toggles mute/unmute
   */
  const toggle = () => {
    if (muted) {
      unmute();
    } else {
      mute();
    }
  };

  return {
    muted,
    isInitialized,
    mute,
    unmute,
    toggle,
  };
}

