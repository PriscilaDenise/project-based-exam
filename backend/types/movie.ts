export interface Genre {
  id: number;
  tmdb_id: number;
  name: string;
  slug: string;
  movie_count?: number;
}

export interface Person {
  id: number;
  tmdb_id: number;
  name: string;
  profile_url: string | null;
  known_for_department: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  directed_movies?: MovieCompact[];
  acted_movies?: MovieCompact[];
}