/**
 * Text-to-speech for voice-driven browsing (Web Speech API).
 * Cancels any in-progress utterance before speaking again.
 */

import {
  cancelPendingNarration,
  queueNarrationAfterMicReleased,
  resumeRecognitionAfterNarration,
} from "@/lib/voiceSpeechOrchestration";

export function stopVoiceNarration(): void {
  cancelPendingNarration();
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  resumeRecognitionAfterNarration();
}

export function extractMovieTitleFromElement(el: HTMLElement): string | null {
  const label = el.getAttribute("aria-label");
  if (label?.trim()) return label.trim();

  const heading = el.querySelector("h1, h2, h3, h4");
  const fromHeading = heading?.textContent?.trim();
  if (fromHeading) return fromHeading;

  const text = el.textContent?.replace(/\s+/g, " ").trim();
  if (text && text.length > 0 && text.length < 180) return text;

  return null;
}

export function speakMovieTitle(title: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const clean = title.replace(/\s+/g, " ").trim();
  if (!clean) return;

  cancelPendingNarration();
  window.speechSynthesis.cancel();

  const run = () => {
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 0.92;
    utter.pitch = 1;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (en) utter.voice = en;
    utter.onend = () => resumeRecognitionAfterNarration();
    utter.onerror = () => resumeRecognitionAfterNarration();
    window.speechSynthesis.speak(utter);
  };

  const startSpeak = () => {
    if (window.speechSynthesis.getVoices().length > 0) {
      run();
      return;
    }
    const onVoices = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      run();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
      run();
    }, 750);
  };

  queueNarrationAfterMicReleased(() => {
    requestAnimationFrame(() => startSpeak());
  });
}
