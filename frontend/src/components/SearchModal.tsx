"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2, Star, TrendingUp, Mic, MicOff } from "lucide-react";
import { moviesAPI } from "@/lib/api";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import VoiceWaves from "@/components/VoiceWaves";
import { posterUrl } from "@/lib/utils";
import type { MovieCompact } from "@/types/movie";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function SearchModal({ open, onClose, initialQuery = "" }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieCompact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isListening, transcript, error, startListening, stopListening } = useVoiceSearch();

  // Sync transcript to query while listening
  useEffect(() => {
    if (isListening && transcript) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (open) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [open, initialQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await moviesAPI.search(query);
        setResults((data.results || []).slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard nav in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex].tmdb_id || results[selectedIndex].id);
    }
  };

  const handleSelect = useCallback(
    (tmdbId: number) => {
      router.push(`/movie/${tmdbId}`);
      onClose();
    },
    [router, onClose]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh]"
      data-voice-search-modal
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-0/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 animate-scale-in">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          {/* Shine line */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

          {/* Search Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 px-5 py-4"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gold/40 flex-shrink-0" />
              
              {error ? (
                <div className="group relative">
                  <MicOff className="w-5 h-5 text-red-500/50" />
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-surface-0 border border-red-500/20 rounded-lg text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {error}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-1.5 rounded-lg transition-all ${
                    isListening 
                    ? "bg-gold text-surface-0 shadow-lg shadow-gold/20 scale-110" 
                    : "text-gold/60 hover:text-gold hover:bg-gold/10"
                  }`}
                  aria-label={isListening ? "Stop listening" : "Search by voice"}
                >
                  <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                </button>
              )}
              <VoiceWaves isActive={isListening} />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              placeholder="Search movies, directors, actors..."
              className="flex-1 bg-transparent text-white placeholder:text-white/25 outline-none text-lg font-body"
            />
            
            <div className="flex items-center gap-2">
              {loading && <Loader2 className="w-5 h-5 text-gold/40 animate-spin" />}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[10px] text-white/20 px-2 py-1 rounded border border-white/8 font-mono hover:border-white/15 transition-colors"
            >
              ESC
            </button>
          </form>

          {/* Divider */}
          {(results.length > 0 || (query.length >= 2 && !loading)) && (
            <div className="h-px bg-white/[0.04]" />
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-[45vh] overflow-y-auto p-2">
              <p className="text-[10px] uppercase tracking-wider text-white/20 px-3 py-2 font-semibold">
                Movies
              </p>
              {results.map((movie, i) => (
                <button
                  key={movie.id || movie.tmdb_id}
                  type="button"
                  data-voice-movie-result
                  aria-label={movie.title}
                  onClick={() => handleSelect(movie.tmdb_id || movie.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                    i === selectedIndex
                      ? "bg-gold/10 border border-gold/15"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="w-11 h-[66px] rounded-lg overflow-hidden bg-surface-3 flex-shrink-0 border border-white/5">
                    <Image
                      src={posterUrl(movie.poster_url || (movie as any).poster_path, "w185")}
                      alt={movie.title}
                      width={44}
                      height={66}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate text-white/90">
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-white/35 mt-1">
                      {movie.year && <span>{movie.year}</span>}
                      {movie.vote_average > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-gold fill-gold" />
                          <span className="text-gold/80">{movie.vote_average.toFixed(1)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {/* See all */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 text-sm text-gold/60 hover:text-gold py-3 transition-colors"
              >
                See all results for &ldquo;{query}&rdquo;
                <span className="text-gold/40">→</span>
              </button>
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && !loading && results.length === 0 && (
            <div className="p-10 text-center">
              <Search className="w-8 h-8 mx-auto mb-3 text-white/10" />
              <p className="text-sm text-white/25">
                No movies found for &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {/* Empty state */}
          {query.length < 2 && (
            <div className="p-4 pb-5">
              <p className="text-[10px] uppercase tracking-wider text-white/20 px-3 py-2 font-semibold">
                Try searching for
              </p>
              <div className="flex flex-wrap gap-2 px-3">
                {["Inception", "Christopher Nolan", "Sci-Fi", "The Godfather", "Studio Ghibli"].map(
                  (hint) => (
                    <button
                      key={hint}
                      onClick={() => setQuery(hint)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[12px] text-white/40 hover:text-white/60 hover:border-gold/15 transition-all"
                    >
                      {hint}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
