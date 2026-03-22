import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {API_CONFIG} from '../../config/api.config';
import {Observable, map} from 'rxjs';
import {MediaListResponse} from '../../../shared/models/PaginatedResponse';
import { MediaDetail, MediaType } from '../../../shared/models/MediaDetail';
import { ActorDetail } from '../../../shared/models/ActorDetail';

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
        {headers: this.headers, params}
      ).pipe(
        map(response => ({
          ...response,
          results: response.results.filter(
            item => item.media_type === 'movie' || item.media_type === 'tv'
          )
        }))
      )
  }

  searchMedia(query: string, page: number = 1): Observable<MediaListResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('include_adult', false);

    return this.http
      .get<MediaListResponse>(
        `${API_CONFIG.tmdbBaseUrl}/search/multi`,
        { headers: this.headers, params }
      ).pipe(
        map((response) => ({
          ...response,
          results: response.results.filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv'
          )
        }))
      );
  }

  getMediaDetail(mediaType: MediaType, mediaId: number): Observable<MediaDetail> {
    const params = new HttpParams().set('append_to_response', 'credits,videos');

    return this.http
      .get<MediaDetail>(
        `${API_CONFIG.tmdbBaseUrl}/${mediaType}/${mediaId}`,
        { headers: this.headers, params }
      )
      .pipe(
        map((response) => ({
          ...response,
          media_type: mediaType
        }))
      );
  }

  getActorDetail(actorId: number): Observable<ActorDetail> {
    const params = new HttpParams().set('append_to_response', 'combined_credits');

    return this.http.get<ActorDetail>(
      `${API_CONFIG.tmdbBaseUrl}/person/${actorId}`,
      { headers: this.headers, params }
    );
  }
}
