import {Component, input} from '@angular/core';
import {Media} from '../../../../shared/models/Media';
import {MovieCard} from '../../../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-explore',
  imports: [
    MovieCard
  ],
  templateUrl: './explore.html'
})
export class Explore {
  movies = input.required<Media[]>();
}
