import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { API_CONFIG } from '../../../core/config/api.config';
import { Media } from '../../models/Media';

@Component({
  selector: 'app-movie-card',
  imports: [NgOptimizedImage],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class MovieCard {
  private readonly router = inject(Router);

  readonly movie = input.required<Media>();

  readonly trailerClicked = output<Media>();
  readonly favoriteClicked = output<Media>();

  readonly imageLoadFailed = signal(false);

  readonly title = computed(() => this.movie().title || this.movie().name);
  readonly movieDetailUrl = computed(() => `/movie/${this.movie().id}`);
  readonly formattedRating = computed(() => this.movie().vote_average.toFixed(1));
  readonly releaseYear = computed(() => {
    const releaseDate = this.movie().release_date || this.movie().first_air_date;
    return releaseDate ? releaseDate.split('-')[0] : 'TBA';
  });
  readonly mediaType = computed(() => this.movie().media_type.toUpperCase());
  readonly posterUrl = computed(() => {
    const posterPath = this.movie().poster_path;
    return posterPath === null ? '' : `${API_CONFIG.tmdbImageBaseUrl}/w780${posterPath}`;
  });

  constructor() {
    effect(() => {
      this.movie();
      this.imageLoadFailed.set(false);
    });
  }

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  onTrailerClick(): void {
    this.trailerClicked.emit(this.movie());
  }

  onFavoriteClick(): void {
    this.favoriteClicked.emit(this.movie());
  }

  onCardClick(): void {
    void this.router.navigateByUrl(this.movieDetailUrl());
  }

  onCardKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.onCardClick();
  }
}
