import { environment } from '@environments/environment';

export const API_CONFIG = {
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/',
  tmdbApiKey: environment.tmdbApiKey
}
