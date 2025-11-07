/**
 * Utility functions for sound playback
 * Centralizes sound management logic
 */

let audioInstance: HTMLAudioElement | null = null;

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
 */
function unlockAudio(): void {
  const audio = getAudioInstance();
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Audio unlocked, pause immediately
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {
        // Ignore errors during unlock attempt
      });
  }
}

/**
 * Plays timer expired sound
 * Handles autoplay restrictions gracefully
 */
export function playTimerExpiredSound(): void {
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
 * Unlocks audio on first user interaction
 * Call this once when the app loads to enable audio playback
 */
export function initializeAudio(): void {
  // Unlock audio on any user interaction
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

