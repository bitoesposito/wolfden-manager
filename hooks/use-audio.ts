"use client";

import { useState, useEffect } from 'react';
import {
  isAudioMuted,
  muteAudio,
  unmuteAudio,
  initAudioState,
} from '@/lib/utils/sound';

/**
 * Hook per gestire lo stato muto/smuto dell'audio
 * Sincronizza lo stato con localStorage e gestisce i permessi del browser
 */
export function useAudio() {
  const [muted, setMuted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inizializza lo stato al mount
  useEffect(() => {
    initAudioState();
    setMuted(isAudioMuted());
    setIsInitialized(true);
  }, []);

  /**
   * Muta l'audio
   */
  const mute = () => {
    muteAudio();
    setMuted(true);
  };

  /**
   * Smuta l'audio e richiede i permessi al browser se necessario
   */
  const unmute = async () => {
    const success = await unmuteAudio();
    if (success) {
      setMuted(false);
    }
    // Se non è riuscito a sbloccare, l'utente dovrà interagire con la pagina
    // ma comunque impostiamo lo stato come smutato
    setMuted(false);
  };

  /**
   * Toggle muto/smuto
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

