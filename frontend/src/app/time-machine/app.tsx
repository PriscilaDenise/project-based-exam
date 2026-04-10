"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, Sparkles, Trophy, Flame, Ghost, 
  ChevronLeft, ChevronRight, Calendar, Info, Star,
  Award, Globe, User as UserIcon
} from "lucide-react";
import { moviesAPI } from "@/lib/api";
import MovieCard from "@/components/MovieCard";

const ERAS = [
  { id: "silent", label: "Silent Pioneers", range: [1888, 1929], color: "from-zinc-400 to-zinc-600", accent: "text-zinc-400" },
  { id: "golden", label: "Golden Age", range: [1930, 1949], color: "from-amber-500 to-yellow-700", accent: "text-amber-500" },
  { id: "classic", label: "Classic Hollywood", range: [1950, 1969], color: "from-blue-400 to-indigo-600", accent: "text-blue-400" },
  { id: "retro", label: "New Hollywood", range: [1970, 1985], color: "from-orange-500 to-red-700", accent: "text-orange-500" },
  { id: "digital", label: "Digital Dawn", range: [1986, 2005], color: "from-cyan-400 to-purple-600", accent: "text-cyan-400" },
  { id: "modern", label: "Modern Odyssey", range: [2006, 2024], color: "from-emerald-400 to-teal-600", accent: "text-emerald-400" },
];

export default function TimeMachinePage() {
  const [selectedYear, setSelectedYear] = useState(1994);
  const [capsule, setCapsule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState<Record<number, any>>({});
  const dialRef = useRef<HTMLDivElement>(null);

  const getEra = (year: number) => {
    const era = ERAS.find(e => year >= e.range[0] && year <= e.range[1]) || ERAS[ERAS.length-1];
    let fxClass = "";
    if (era.id === "silent") fxClass = "era-fx-silent";
    else if (era.id === "golden") fxClass = "era-fx-golden";
    else if (era.id === "classic") fxClass = "era-fx-classic";
    else if (era.id === "retro") fxClass = "era-fx-retro";
    else if (era.id === "digital") fxClass = "era-fx-digital";
    return { ...era, fxClass };
  };
