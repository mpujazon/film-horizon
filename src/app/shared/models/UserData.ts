export type MediaType = 'movie' | 'tv';

export interface WatchlistItem {
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  createdAt: Date;
}
