type MediaType = 'movie' | 'tv';

interface WatchlistItem {
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  createdAt: Date;
}

interface UserRating {
  userId: string;
  tmdbId: number;
  mediaType: MediaType;
  rating: number;
  updatedAt: Date;
}
