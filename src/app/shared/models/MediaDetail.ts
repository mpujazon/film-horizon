export type MediaType = 'movie' | 'tv';

export interface MediaGenre {
  id: number;
  name: string;
}

export interface MediaVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MediaVideosResponse {
  results: MediaVideo[];
}

export interface MediaCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MediaCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface MediaCreditsResponse {
  cast: MediaCastMember[];
  crew: MediaCrewMember[];
}

export interface MediaCreator {
  id: number;
  name: string;
}

export interface MediaDetail {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  tagline: string;
  status: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  vote_average: number;
  vote_count: number;
  genres: MediaGenre[];
  media_type: MediaType;
  created_by?: MediaCreator[];
  credits?: MediaCreditsResponse;
  videos?: MediaVideosResponse;
}
