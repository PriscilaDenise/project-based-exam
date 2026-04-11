import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string, options?: { format?: 'short' | 'long' | 'numeric' }): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  
  const format = options?.format || 'long';
  switch (format) {
    case 'short':
      return date.toLocaleDateString("en-US", {
        year: "2-digit",
        month: "short",
        day: "numeric",
      });
    case 'numeric':
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    default:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
}

export function ratingColor(rating: number): string {
  if (rating >= 8) return "text-emerald-400";
  if (rating >= 6) return "text-amber-300";
  if (rating >= 4) return "text-orange-400";
  return "text-red-400";
}

export function posterUrl(path: string | null): string {
  if (!path) return "/placeholder-poster.svg";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/w500${path}`;
}

export function backdropUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/w1280${path}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}