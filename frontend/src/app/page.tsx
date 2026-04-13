"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Star, Clapperboard, Flame, Crown } from "lucide-react";
import MovieCarousel from "@/components/MovieCarousel";
import GenreGrid from "@/components/GenreGrid";
import HeroSection from "@/components/HeroSection";
import PersonalizedSection from "@/components/PersonalizedSection";
import MoodTeaser from "@/components/MoodTeaser";
import { moviesAPI } from "@/lib/api";
import type { MovieCompact } from "@/types/movie";

export default function HomePage() {
  const [trending, setTrending] = useState<MovieCompact[]>([]);
  const [nowPlaying, setNowPlaying] = useState<MovieCompact[]>([]);
  const [topRated, setTopRated] = useState<MovieCompact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendRes, npRes, trRes] = await Promise.allSettled([
          moviesAPI.trending(),
          moviesAPI.nowPlaying(),
          moviesAPI.topRated(),
        ]);

        if (trendRes.status === "fulfilled") setTrending(trendRes.value.results || []);
        if (npRes.status === "fulfilled") setNowPlaying(npRes.value.results);
        if (trRes.status === "fulfilled") setTopRated(trRes.value.results);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);