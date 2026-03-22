export type MediaType = 'movie' | 'tv';

export interface WatchlistItem {
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  createdAt: Date;
}

export interface UserRating {
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  rating: number;
  updatedAt: Date;
}
