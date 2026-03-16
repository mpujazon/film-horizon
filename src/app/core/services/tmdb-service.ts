import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {API_CONFIG} from '../config/api.config';
import {Observable, map} from 'rxjs';
import {MediaListResponse} from '../../shared/models/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);
  private headers = new HttpHeaders(({
    Authorization: `Bearer ${API_CONFIG.tmdbApiKey}`
  }));

  getTrendingMedia(page: number = 1): Observable<MediaListResponse>{
    const params = new HttpParams().set('page', page);

    return this.http
      .get<MediaListResponse>(
        `${API_CONFIG.tmdbBaseUrl}/trending/all/week`,
        {headers: this.headers}
      ).pipe(
        map(response => ({
          ...response,
          results: response.results.filter(
            item => item.media_type === 'movie' || item.media_type === 'tv'
          )
        }))
      )
  }
}
