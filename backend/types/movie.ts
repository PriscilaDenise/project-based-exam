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

export interface MovieCompact {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  release_date: string;
  year: number | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_url: string | null;
  poster_url_small: string | null;
  genres: Genre[];
  runtime: number | null;
  genre_ids?: number[];
}

export interface CastMember {
  person: Person;
  character: string;
  order: number;
}