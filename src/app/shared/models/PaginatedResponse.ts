import {Media} from './Media';

export interface PaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export type MediaListResponse = PaginatedResponse<Media>;
