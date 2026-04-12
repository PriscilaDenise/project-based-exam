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

        {/* Dynamic Cultural Tape (Ticker) */}
        {!loading && capsule && (
          <div className="mb-12 border-y border-white/5 py-3 overflow-hidden group">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-16 whitespace-nowrap"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                <Globe className="w-3.5 h-3.5 text-gold" />
                <span>Historical Context :</span>
              </div>
              {capsule.events.map((evt: string, i: number) => (
                <span key={i} className="text-sm font-medium text-white/60">• {evt}</span>
              ))}
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="h-[500px] flex flex-col items-center justify-center gap-4">
              <div className={`w-12 h-12 border-4 border-t-transparent ${activeEra.accent.replace("text", "border")} rounded-full animate-spin`} />
              <p className="text-white/40 animate-pulse font-display italic">Syncing Temporal Coordinates...</p>
            </div>
          ) : capsule && (
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Primary Year Overview */}
              <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  <div className="glass-card rounded-[2rem] p-10 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-3xl bg-gradient-to-r ${activeEra.color} text-surface-0 text-xs font-black uppercase tracking-widest`}>
                      {activeEra.label}
                    </div>
                    <div className="space-y-6">
                      <h2 className="text-4xl md:text-5xl font-bold font-display leading-[1.1]">
                        Cinematic <span className={activeEra.accent}>Briefing</span>
                      </h2>
                      <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light italic">
                        "{capsule.briefing}"
                      </p>
                    </div>
                  </div>

                  {/* Iconic Faces of the Year */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-white/30 uppercase text-[10px] font-bold tracking-[0.2em] ml-2">
                       <UserIcon className="w-3.5 h-3.5" />
                       <span>Epoch Icons</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                      {capsule.icons.map((person: any, i: number) => (
                        <div key={i} className="flex-shrink-0 group cursor-default">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-gold transition-colors mb-2">
                            <img 
                              src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x185?text=No+Photo'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt={person.name}
                            />
                          </div>
                          <p className="text-center text-[10px] font-bold text-white/40 group-hover:text-white transition-colors uppercase truncate w-24">
                            {person.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  {/* Oscars Spotlight */}
                  {capsule.oscar_winner && (
                    <div className="relative glass-card rounded-3xl p-6 border-gold/20 bg-gold/5 group hover:bg-gold/10 transition-all duration-500 overflow-hidden">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Award className="w-32 h-32 text-gold" />
                      </div>
                      <div className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-widest mb-4">
                        <Award className="w-4 h-4" />
                        <span>Best Picture Winner</span>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-2xl">
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${capsule.oscar_winner.poster_path}`} 
                            className="w-full h-full object-cover" 
                            alt="Oscar Winner" 
                          />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h3 className="text-lg font-bold text-white leading-tight">{capsule.oscar_winner.title}</h3>
                          <p className="text-xs text-white/40 mt-1 uppercase font-bold tracking-tighter">Director Highlight</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Era Highlights */}
                  <div className="grid gap-4">
                    <HighlightItem icon={<Trophy className="w-4 h-4" />} label="Year titan" movie={capsule.categories.titan} />
                    <HighlightItem icon={<Star className="w-4 h-4" />} label="Critics' Choice" movie={capsule.categories.critics_choice} />
                  </div>
                </div>
              </div>

              {/* Discovery Grid */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold font-display">The {selectedYear} Retrospective</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {capsule.top_list.map((movie: any) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HighlightItem({ icon, label, movie }: { icon: React.ReactNode, label: string, movie: any }) {
  if (!movie) return null;
  return (
    <div className="group relative glass-card rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-14 rounded-lg bg-surface-1 overflow-hidden flex-shrink-0">
          <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} className="w-full h-full object-cover" alt={movie.title} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-gold text-[10px] font-bold uppercase tracking-wider">
            {icon} <span>{label}</span>
          </div>
          <h4 className="text-sm font-bold truncate text-white">{movie.title}</h4>
        </div>
      </div>
    </div>
  );
}
