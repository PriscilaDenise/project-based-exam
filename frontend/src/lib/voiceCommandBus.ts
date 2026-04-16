export type VoiceActionDetail =
  | { type: "scroll"; direction: "up" | "down" }
  | { type: "movie-focus"; delta: number }
  | { type: "movie-focus-index"; index: number }
  | { type: "movie-select" }
  | { type: "play-trailer" }
  | { type: "close-trailer" };

export const VOICE_ACTION_EVENT = "cinequest-voice-action";

export function emitVoiceAction(detail: VoiceActionDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<VoiceActionDetail>(VOICE_ACTION_EVENT, { detail }));
}

export function subscribeVoiceAction(
  handler: (detail: VoiceActionDetail) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const fn = (e: Event) => {
    handler((e as CustomEvent<VoiceActionDetail>).detail);
  };
  window.addEventListener(VOICE_ACTION_EVENT, fn);
  return () => window.removeEventListener(VOICE_ACTION_EVENT, fn);
}
