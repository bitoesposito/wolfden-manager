/**
 * Utility functions for sound playback
 * Centralizes sound management logic
 */

let audioInstance: HTMLAudioElement | null = null;
let isMuted = false;
let audioUnlocked = false;

// Chiave per localStorage
const MUTE_STORAGE_KEY = 'wolfden-audio-muted';

/**
 * Carica lo stato muto da localStorage
 * Se il browser blocca l'audio di default, parte da muto
 */
function loadMuteState(): boolean {
  if (typeof window === 'undefined') return true;
  
  const saved = localStorage.getItem(MUTE_STORAGE_KEY);
  if (saved !== null) {
    return saved === 'true';
  }
  
  // Se non c'è uno stato salvato, parte da muto per sicurezza
  // (il browser potrebbe bloccare l'audio)
  return true;
}

/**
 * Salva lo stato muto in localStorage
 */
function saveMuteState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
}

/**
 * Inizializza lo stato muto
 */
function initMuteState(): void {
  isMuted = loadMuteState();
}

/**
 * Initializes audio instance if it doesn't exist
 */
function getAudioInstance(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio('/alarm.mp3');
    audioInstance.volume = 1;
    // Preload audio to avoid delays
    audioInstance.preload = 'auto';
  }
  return audioInstance;
}

/**
 * Unlocks audio context by attempting to play and pause
 * Required for browsers that block autoplay
 * Ritorna true se l'audio è stato sbloccato con successo
 */
function unlockAudio(): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = getAudioInstance();
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio unlocked, pause immediately
          audio.pause();
          audio.currentTime = 0;
          audioUnlocked = true;
          resolve(true);
        })
        .catch(() => {
          // Ignore errors during unlock attempt
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
}

/**
 * Plays timer expired sound
 * Handles autoplay restrictions gracefully
 * Non riproduce se l'audio è muto
 */
export function playTimerExpiredSound(): void {
  if (isMuted) {
    return;
  }
  
  const audio = getAudioInstance();
  
  const playSound = () => {
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Silently handle autoplay restrictions
        // This is expected behavior in browsers that require user interaction
        if (error.name !== 'NotAllowedError') {
          console.error('Error playing sound:', error);
        }
      });
    }
  };

  playSound();
}

/**
 * Muta l'audio
 */
export function muteAudio(): void {
  isMuted = true;
  saveMuteState(true);
}

/**
 * Smuta l'audio e richiede i permessi al browser se necessario
 */
export async function unmuteAudio(): Promise<boolean> {
  isMuted = false;
  saveMuteState(false);
  
  // Se l'audio non è ancora sbloccato, prova a sbloccarlo
  if (!audioUnlocked) {
    const unlocked = await unlockAudio();
    return unlocked;
  }
  
  return true;
}

/**
 * Verifica se l'audio è muto
 */
export function isAudioMuted(): boolean {
  return isMuted;
}

/**
 * Inizializza lo stato audio all'avvio
 */
export function initAudioState(): void {
  initMuteState();
}

/**
 * Unlocks audio on first user interaction
 * Call this once when the app loads to enable audio playback
 * Non viene chiamato automaticamente se l'audio è muto
 */
export function initializeAudio(): void {
  // Inizializza lo stato muto
  initAudioState();
  
  // Se l'audio non è muto, prova a sbloccarlo al primo click
  // Altrimenti aspetta che l'utente smuti manualmente
  if (!isMuted) {
    const unlock = () => {
      unlockAudio();
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };

    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  }
}

