import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import { FeaturedCarousel } from '../../components/featured-carousel/featured-carousel';
import {TmdbService} from '../../../../core/services/tmdb-service';
import {Observable, map} from 'rxjs';
import {Movie} from '../../../../shared/models/Movie';
import {MovieCard} from '../../../../shared/components/movie-card/movie-card';
import {Explore} from '../../components/explore/explore';

@Component({
  selector: 'app-homepage',
  imports: [
    AsyncPipe,
    FeaturedCarousel,
    MovieCard,
    Explore
  ],
  templateUrl: './homepage.html'
})
export class Homepage{
  tmdbService = inject(TmdbService);

  featuredMovies$: Observable<Movie[]> =
    this.tmdbService.getFeaturedMovies()
      .pipe(map((response)=> response.results.slice(0,10)));
}
