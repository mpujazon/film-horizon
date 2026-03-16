import {Movie} from './Movie';

export interface PaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export type TrendingMoviesResponse = PaginatedResponse<Movie>;
