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

    useEffect(() => {
    const fetchCapsule = async (year: number) => {
      if (cache[year]) {
        setCapsule(cache[year]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await moviesAPI.getTimeCapsule(year);
        setCache(prev => ({ ...prev, [year]: data }));
        setCapsule(data);
      } catch (err) {
        console.error("Failed to fetch capsule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCapsule(selectedYear);
    
    // Prefetching adjacent years
    [selectedYear - 1, selectedYear + 1].forEach(yr => {
      if (yr >= 1888 && yr <= 2024 && !cache[yr]) {
        moviesAPI.getTimeCapsule(yr).then(data => {
          setCache(prev => ({ ...prev, [yr]: data }));
        });
      }
    });
  }, [selectedYear]);

  const activeEra = getEra(selectedYear);
  const titan = capsule?.categories?.titan;

    return (
    <div className={`min-h-screen pt-24 pb-20 transition-all duration-1000 bg-surface-0 overflow-hidden`}>
      {/* Immersive Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear + "bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          {titan?.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w1280${titan.poster_path}`} 
              className={`w-full h-full object-cover blur-[100px] scale-110 ${activeEra.fxClass}`}
              alt="Era Backdrop"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-b ${activeEra.color} mix-blend-overlay`} />
        </motion.div>
      </AnimatePresence>

      {/* Temporal FX Overlays */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {activeEra.id === "silent" && <div className="era-vignette opacity-60" />}
        {activeEra.id === "golden" && <div className="era-vignette opacity-40" />}
        {(activeEra.id === "retro" || activeEra.id === "digital") && <div className="era-scanlines opacity-20" />}
        <div className="noise" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        {/* Header & Temporal Dial */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text-gold font-display text-sm uppercase tracking-widest mb-1">
              <History className="w-4 h-4" />
              <span>Temporal Discovery</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tighter leading-none transition-all duration-700">
              {selectedYear}<span className={`text-4xl align-top ml-2 ${activeEra.accent}`}>A.D</span>
            </h1>
          </motion.div>

          {/* High-Fidelity Temporal Dial */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y border-white/10 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold z-20" />
            
            <div 
              ref={dialRef}
              className="flex gap-12 overflow-x-auto no-scrollbar py-8 px-[50%] scroll-smooth snap-x"
            >
              {Array.from({ length: 2024 - 1888 + 1 }, (_, i) => 2024 - i).map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-shrink-0 snap-center transition-all duration-300 flex flex-col items-center
                    ${selectedYear === year ? 'scale-150 text-white' : 'scale-75 text-white/20'}`}
                >
                  <span className="text-xl font-bold font-display">{year}</span>
                  <div className={`w-1 h-4 mt-2 ${selectedYear === year ? 'bg-gold' : 'bg-white/10'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
