"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface VoiceCommand {
  patterns: string[];
  callback: (transcript: string) => void;
}

export function useVoiceNavigation(commands: VoiceCommand[]) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const shouldBeListening = useRef(false);

  useEffect(() => {
    const SpeechRecognition = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log("Voice Command Recognized:", transcript);
        setLastCommand(transcript);

        for (const cmd of commands) {
          if (cmd.patterns.some(p => transcript.includes(p.toLowerCase()))) {
            cmd.callback(transcript);
            break;
          }
        }
      };

      recognition.onstart = () => {
        setIsListening(true);
        console.log("Speech recognition session started");
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log("Speech recognition session ended");
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
    }

    return () => {
      shouldBeListening.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [commands]);

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
