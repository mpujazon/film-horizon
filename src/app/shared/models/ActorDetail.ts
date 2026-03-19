export interface ActorCredit {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  character?: string;
  poster_path: string | null;
  vote_average?: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
}

export interface ActorCreditsResponse {
  cast: ActorCredit[];
}

export interface ActorDetail {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  known_for_department: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  popularity: number;
  combined_credits?: ActorCreditsResponse;
}
