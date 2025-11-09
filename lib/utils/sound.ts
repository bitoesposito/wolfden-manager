/**
 * Utility functions for sound playback
 * Centralizes sound management logic
 */

let audioInstance: HTMLAudioElement | null = null;
let isMuted = false;
let audioUnlocked = false;
let audioQueue = 0;
let isPlaying = false;

const MUTE_STORAGE_KEY = 'wolfden-audio-muted';

/**
 * Loads mute state from localStorage
 * Defaults to muted if browser blocks audio
 */
function loadMuteState(): boolean {
  if (typeof window === 'undefined') return true;
  
  const saved = localStorage.getItem(MUTE_STORAGE_KEY);
  if (saved !== null) {
    return saved === 'true';
  }
  
  return true;
}

function saveMuteState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
}

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
 * Returns true if audio was successfully unlocked
 */
function unlockAudio(): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = getAudioInstance();
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audioUnlocked = true;
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    } else {
      resolve(false);
    }
  });
}

/**
 * Sets up handler for audio end event
 * When audio ends, plays next in queue if available
 */
function setupAudioEndedHandler(audio: HTMLAudioElement): void {
  audio.onended = () => {
    isPlaying = false;
    if (audioQueue > 0) {
      playNextInQueue();
    }
  };
}

/**
 * Plays next audio in queue
 * Called when audio ends or when queue is ready to play
 */
function playNextInQueue(): void {
  if (audioQueue === 0) {
    return;
  }

  const audio = getAudioInstance();
  
  if (isPlaying || !audio.paused) {
    return;
  }

  isPlaying = true;
  audioQueue--;

  audio.currentTime = 0;
  const playPromise = audio.play();
  
  setupAudioEndedHandler(audio);
  
  if (playPromise !== undefined) {
    playPromise
      .catch((error) => {
        isPlaying = false;
        if (error.name !== 'NotAllowedError') {
          console.error('Error playing sound:', error);
        }
        if (audioQueue > 0) {
          playNextInQueue();
        }
      });
  }
}

/**
 * Plays timer expired sound
 * Manages playback queue: if audio is already playing, adds to queue instead of overlapping
 * Does not play if audio is muted
 */
export function playTimerExpiredSound(): void {
  if (isMuted) {
    return;
  }
  
  const audio = getAudioInstance();
  
  audioQueue++;
  
  if (!isPlaying && audio.paused) {
    playNextInQueue();
  }
}

export function muteAudio(): void {
  isMuted = true;
  saveMuteState(true);
}

/**
 * Unmutes audio and requests browser permissions if needed
 */
export async function unmuteAudio(): Promise<boolean> {
  isMuted = false;
  saveMuteState(false);
  
  if (!audioUnlocked) {
    const unlocked = await unlockAudio();
    return unlocked;
  }
  
  return true;
}

export function isAudioMuted(): boolean {
  return isMuted;
}

export function initAudioState(): void {
  initMuteState();
}

/**
 * Unlocks audio on first user interaction
 * Call this once when the app loads to enable audio playback
 * Not called automatically if audio is muted
 */
export function initializeAudio(): void {
  initAudioState();
  
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

