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
import { catchError, finalize, map, of } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { TmdbService } from '../../../core/services/tmdb/tmdb-service';
import { Media } from '../../models/Media';
import { MediaVideo } from '../../models/MediaDetail';
import { TrailerModal } from '../trailer-modal/trailer-modal';
import { WatchlistButton, WatchlistChangeEvent } from '../watchlist-button/watchlist-button';

@Component({
  selector: 'app-movie-card',
  imports: [NgOptimizedImage, TrailerModal, WatchlistButton],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class MovieCard {
  private readonly router = inject(Router);
  private readonly tmdbService = inject(TmdbService);

  readonly movie = input.required<Media>();
  readonly watchlistChanged = output<WatchlistChangeEvent>();

  readonly imageLoadFailed = signal(false);
  readonly isTrailerLoading = signal(false);
  readonly isTrailerModalOpen = signal(false);
  readonly trailerKey = signal<string | null>(null);

  readonly title = computed(() => this.movie().title || this.movie().name || 'Untitled');
  readonly movieDetailUrl = computed(() => {
    const mediaTypePath = this.movie().media_type === 'tv' ? 'tv' : 'movie';
    return `/${mediaTypePath}/${this.movie().id}`;
  });
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
    if (this.isTrailerLoading()) {
      return;
    }

    const movie = this.movie();
    this.isTrailerLoading.set(true);

    this.tmdbService
      .getMediaDetail(movie.media_type, movie.id)
      .pipe(
        map((detail) => this.getTrailerKey(detail.videos?.results ?? [])),
        catchError(() => of(null)),
        finalize(() => {
          this.isTrailerLoading.set(false);
        })
      )
      .subscribe((trailerKey) => {
        if (!trailerKey) {
          return;
        }

        this.trailerKey.set(trailerKey);
        this.isTrailerModalOpen.set(true);
      });
  }

  closeTrailerModal(): void {
    this.isTrailerModalOpen.set(false);
    this.trailerKey.set(null);
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

  onWatchlistChanged(event: WatchlistChangeEvent): void {
    this.watchlistChanged.emit(event);
  }

  private getTrailerKey(videos: MediaVideo[]): string | null {
    const trailer =
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) ??
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ??
      null;

    return trailer?.key ?? null;
  }
}
