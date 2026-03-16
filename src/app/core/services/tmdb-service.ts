import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../config/api.config';
import {Observable} from 'rxjs';
import {MediaListResponse} from '../../shared/models/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);

  getTrendingMedia(): Observable<MediaListResponse>{
    return this.http.get<MediaListResponse>(`${API_CONFIG.tmdbBaseUrl}/trending/all/week`, {
      headers: {
        Authorization: `Bearer ${API_CONFIG.tmdbApiKey}`
      }
    });
  }
}
