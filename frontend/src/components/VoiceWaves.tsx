"use client";

import React from "react";

export default function VoiceWaves({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-1 h-4 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-0.5 bg-gold rounded-full animate-voice-wave"
          style={{
            height: "100%",
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.8s"
          }}
        />
      ))}
      <style jsx>{`
        @keyframes voice-wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
        .animate-voice-wave {
          animation-name: voice-wave;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
}
