/**
 * Coordinates Web Speech Recognition with speechSynthesis — many browsers
 * will not play TTS while the recognition session is active.
 */

type VoiceRecHooks = {
  stop: () => void;
  start: () => void;
  isRunning: () => boolean;
  shouldResume: () => boolean;
};

let hooks: VoiceRecHooks | null = null;

let pendingNarration: (() => void) | null = null;
let waitingForRecognitionStop = false;

/** Clears a queued speak (e.g. new focus or mic turned off). */
export function cancelPendingNarration(): void {
  pendingNarration = null;
  waitingForRecognitionStop = false;
}

export function registerVoiceRecognitionForNarration(h: VoiceRecHooks): () => void {
  hooks = h;
  return () => {
    hooks = null;
    pendingNarration = null;
    waitingForRecognitionStop = false;
  };
}

/**
 * Call from recognition `onend` — if we stopped to play TTS, run the pending speak callback.
 * @returns true if the event was consumed (caller should skip auto-restart).
 */
export function notifyRecognitionEndedForNarration(): boolean {
  if (!waitingForRecognitionStop || !pendingNarration) return false;
  const fn = pendingNarration;
  pendingNarration = null;
  waitingForRecognitionStop = false;
  setTimeout(fn, 150);
  return true;
}

export function queueNarrationAfterMicReleased(speakFn: () => void): void {
  if (!hooks || !hooks.isRunning()) {
    speakFn();
    return;
  }
  waitingForRecognitionStop = true;
  pendingNarration = speakFn;
  try {
    hooks.stop();
  } catch {
    waitingForRecognitionStop = false;
    pendingNarration = null;
    speakFn();
  }
}

export function resumeRecognitionAfterNarration(): void {
  if (!hooks?.shouldResume()) return;
  try {
    hooks.start();
  } catch {
    /* already running */
  }
}
