import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import { FeaturedCarousel } from '../../components/featured-carousel/featured-carousel';
import {TmdbService} from '../../../../core/services/tmdb-service';
import {Observable, map} from 'rxjs';
import {TrendingMoviesResponse} from '../../../../shared/models/PaginatedResponse';
import {Movie} from '../../../../shared/models/Movie';
import {MovieCard} from '../../../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-homepage',
  imports: [
    AsyncPipe,
    FeaturedCarousel,
    MovieCard
  ],
  templateUrl: './homepage.html'
})
export class Homepage{
  tmdbService = inject(TmdbService);

  featuredMovies$: Observable<Movie[]> =
    this.tmdbService.getFeaturedMovies()
      .pipe(map((response)=> response.results/*.slice(0,10)*/));
}
