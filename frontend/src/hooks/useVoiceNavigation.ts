"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  notifyRecognitionEndedForNarration,
  registerVoiceRecognitionForNarration,
} from "@/lib/voiceSpeechOrchestration";

export interface VoiceCommand {
  patterns: string[];
  callback: (transcript: string) => void;
}

/** Normalize STT text so patterns still match (punctuation, smart quotes). */
export function normalizeVoiceTranscript(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[.,!?;:…"""''`]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function useVoiceNavigation(commands: VoiceCommand[]) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldBeListening = useRef(false);
  const recognitionRunningRef = useRef(false);
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  useEffect(() => {
    const SpeechRecognition = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      try {
        recognition.maxAlternatives = 5;
      } catch {
        /* optional */
      }

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const alternatives: string[] = [];
        for (let i = 0; i < result.length; i++) {
          alternatives.push(normalizeVoiceTranscript(result[i].transcript));
        }
        if (alternatives.length === 0) return;

        const primary = alternatives[0];
        console.log("Voice Command Recognized:", alternatives);
        setLastCommand(primary);

        outer: for (const cmd of commandsRef.current) {
          for (const alt of alternatives) {
            if (cmd.patterns.some((p) => alt.includes(normalizeVoiceTranscript(p)))) {
              cmd.callback(alt);
              break outer;
            }
          }
        }
      };

      recognition.onstart = () => {
        recognitionRunningRef.current = true;
        setIsListening(true);
        console.log("Speech recognition session started");
      };

      recognition.onend = () => {
        recognitionRunningRef.current = false;
        console.log("Speech recognition session ended");
        if (notifyRecognitionEndedForNarration()) {
          /* Keep isListening true until TTS ends and recognition restarts (onstart). */
          return;
        }
        setIsListening(false);
        if (shouldBeListening.current) {
          // Small delay to prevent "already started" errors
          setTimeout(() => {
            if (shouldBeListening.current) {
              try {
                recognition.start();
              } catch (e) {
                console.warn("Auto-restart failed:", e);
              }
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;

      const unregister = registerVoiceRecognitionForNarration({
        stop: () => {
          try {
            recognition.stop();
          } catch {
            /* not running */
          }
        },
        start: () => {
          try {
            recognition.start();
          } catch {
            /* already running */
          }
        },
        isRunning: () => recognitionRunningRef.current,
        shouldResume: () => shouldBeListening.current,
      });

      return () => {
        unregister();
        shouldBeListening.current = false;
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        recognitionRef.current = null;
      };
    }

    return () => {};
  }, []);

  const startAssistant = useCallback(() => {
    if (recognitionRef.current) {
      shouldBeListening.current = true;
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  }, []);

  const stopAssistant = useCallback(() => {
    shouldBeListening.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return { isListening, startAssistant, stopAssistant, lastCommand };
}
