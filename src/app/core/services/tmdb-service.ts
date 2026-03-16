import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../config/api.config';
import {Observable} from 'rxjs';
import {TrendingMoviesResponse} from '../../shared/models/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);

  getFeaturedMovies(): Observable<TrendingMoviesResponse>{
    return this.http.get<TrendingMoviesResponse>(`${API_CONFIG.tmdbBaseUrl}/trending/movie/week`, {
      headers: {
        Authorization: `Bearer ${API_CONFIG.tmdbApiKey}`
      }
    });
  }
}
