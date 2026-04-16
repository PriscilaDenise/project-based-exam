"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { subscribeVoiceAction, type VoiceActionDetail } from "@/lib/voiceCommandBus";
import {
  extractMovieTitleFromElement,
  speakMovieTitle,
  stopVoiceNarration,
} from "@/lib/voiceNarration";

function getSelectableMovieEls(): HTMLElement[] {
  const modal = document.querySelector("[data-voice-search-modal]");
  if (modal) {
    const rows = modal.querySelectorAll<HTMLElement>("button[data-voice-movie-result]");
    if (rows.length > 0) return Array.from(rows);
  }
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>('main a[href^="/movie/"]')
  );
}

function clearAllRings(els: HTMLElement[]) {
  els.forEach((el) => el.classList.remove("voice-focus-ring"));
}

/**
 * Handles voice-driven page scroll, movie-card focus ring, and opening the focused movie.
 * Movie links are discovered as <a href="/movie/..."> inside <main> (Navbar/Footer excluded).
 */
export default function VoiceBrowseBridge() {
  const pathname = usePathname();
  const focusIndex = useRef(-1);

  useEffect(() => {
    stopVoiceNarration();
    focusIndex.current = -1;
    const els = getSelectableMovieEls();
    clearAllRings(els);
  }, [pathname]);

  useEffect(() => {
    const applyFocus = (nextIndex: number) => {
      const els = getSelectableMovieEls();
      clearAllRings(els);
      if (els.length === 0) {
        focusIndex.current = -1;
        return;
      }
      const clamped = Math.max(0, Math.min(nextIndex, els.length - 1));
      focusIndex.current = clamped;
      const el = els[clamped];
      el.classList.add("voice-focus-ring");
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      const title = extractMovieTitleFromElement(el);
      if (title) speakMovieTitle(title);
    };

    const handler = (detail: VoiceActionDetail | undefined) => {
      if (!detail?.type) return;
      if (detail.type === "scroll") {
        const amount = Math.round(window.innerHeight * 0.75) * (detail.direction === "down" ? 1 : -1);
        window.scrollBy({ top: amount, behavior: "smooth" });
        return;
      }

      if (detail.type === "movie-focus") {
        const els = getSelectableMovieEls();
        if (els.length === 0) return;
        const start = focusIndex.current < 0 ? 0 : focusIndex.current;
        const next = (start + detail.delta + els.length) % els.length;
        applyFocus(next);
        return;
      }

      if (detail.type === "movie-focus-index") {
        applyFocus(detail.index);
        return;
      }

      if (detail.type === "movie-select") {
        const els = getSelectableMovieEls();
        if (els.length === 0) return;
        const idx =
          focusIndex.current >= 0
            ? Math.min(focusIndex.current, els.length - 1)
            : 0;
        els[idx]?.click();
        return;
      }

      /* play-trailer / close-trailer: handled on movie detail page via subscribeVoiceAction */
    };

    return subscribeVoiceAction(handler);
  }, []);

  return null;
}
