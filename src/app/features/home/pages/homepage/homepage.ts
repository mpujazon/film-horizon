import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import { FeaturedCarousel } from '../../components/featured-carousel/featured-carousel';
import {TmdbService} from '../../../../core/services/tmdb-service';
import {Observable, map} from 'rxjs';
import {Media} from '../../../../shared/models/Media';
import {Explore} from '../../components/explore/explore';

@Component({
  selector: 'app-homepage',
  imports: [
    AsyncPipe,
    FeaturedCarousel,
    Explore
  ],
  templateUrl: './homepage.html'
})
export class Homepage{
  tmdbService = inject(TmdbService);

  featuredMedia$: Observable<Media[]> =
    this.tmdbService.getTrendingMedia()
      .pipe(map((response)=> response.results.slice(0,10)));
}
