import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, firstValueFrom, forkJoin, map, of } from 'rxjs';
import { TmdbService } from '../../../../core/services/tmdb/tmdb-service';
import { WatchlistService } from '../../../../core/services/watchlist/watchlist-service';
import { MovieCard } from '../../../../shared/components/movie-card/movie-card';
import { Media } from '../../../../shared/models/Media';
import { MediaDetail } from '../../../../shared/models/MediaDetail';
import { WatchlistChangeEvent } from '../../../../shared/components/watchlist-button/watchlist-button';

@Component({
  selector: 'app-watchlist-page',
  imports: [MovieCard, RouterLink],
  templateUrl: './watchlist-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistPage {
  private readonly watchlistService = inject(WatchlistService);
  private readonly tmdbService = inject(TmdbService);

  readonly items = signal<Media[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  readonly hasItems = computed(() => this.items().length > 0);
  readonly totalItems = computed(() => this.items().length);

  async ngOnInit(): Promise<void> {
    await this.loadWatchlist();
  }

  async loadWatchlist(): Promise<void> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const watchlistItems = await this.watchlistService.getUserWatchlist();

      if (watchlistItems.length === 0) {
        this.items.set([]);
        return;
      }

      const details$ = watchlistItems.map((item) =>
        this.tmdbService.getMediaDetail(item.mediaType, item.tmdbId).pipe(
          map((detail) => this.mapDetailToMedia(detail)),
          catchError(() => of(null))
        )
      );

      const mediaItems = await firstValueFrom(forkJoin(details$));
      this.items.set(mediaItems.filter((item): item is Media => item !== null));
    } catch {
      this.hasError.set(true);
      this.items.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  onItemWatchlistChanged(event: WatchlistChangeEvent): void {
    if (event.isInWatchlist) {
      return;
    }

    const removedKey = `${event.mediaType}:${event.mediaId}`;
    this.items.update((items) => items.filter((item) => this.getItemKey(item) !== removedKey));
  }

  private mapDetailToMedia(detail: MediaDetail): Media {
    const title = detail.title ?? detail.name ?? 'Untitled';

    return {
      adult: false,
      backdrop_path: detail.backdrop_path,
      id: detail.id,
      title,
      original_language: '',
      original_title: title,
      overview: detail.overview,
      poster_path: detail.poster_path,
      media_type: detail.media_type,
      genre_ids: detail.genres.map((genre) => genre.id),
      popularity: 0,
      release_date: detail.release_date ?? '',
      video: false,
      vote_average: detail.vote_average,
      vote_count: detail.vote_count,
      name: detail.name,
      first_air_date: detail.first_air_date
    };
  }

  private getItemKey(item: Media): string {
    return `${item.media_type}:${item.id}`;
  }
}
