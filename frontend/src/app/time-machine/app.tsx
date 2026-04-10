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