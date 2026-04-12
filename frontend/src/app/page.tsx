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