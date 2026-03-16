import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../config/api.config';
import {Observable} from 'rxjs';
import {FeaturedContent} from '../../shared/models/FeaturedContent';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private http = inject(HttpClient);

  getFeaturedMovies(){
    return this.http.get(`${API_CONFIG.tmdbBaseUrl}/trending/movie/`, {
      headers: {
        Authorization: `Bearer ${API_CONFIG.tmdbApiKey}`
      }
    });
  }
}
