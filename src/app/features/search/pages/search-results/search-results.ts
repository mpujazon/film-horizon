import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';
import { TmdbService } from '../../../../core/services/tmdb-service';
import { MovieCard } from '../../../../shared/components/movie-card/movie-card';
import { Media } from '../../../../shared/models/Media';

@Component({
  selector: 'app-search-results',
  imports: [MovieCard],
  templateUrl: './search-results.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResults {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdbService = inject(TmdbService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly minSearchLength = 2;

  readonly query = signal('');
  readonly results = signal<Media[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  readonly hasValidQuery = computed(() => this.query().length >= this.minSearchLength);
  readonly hasResults = computed(() => this.results().length > 0);

  constructor() {
    this.bindQueryParamSearch();
  }

  private bindQueryParamSearch(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => (params.get('q') ?? '').trim()),
        distinctUntilChanged(),
        tap((query) => {
          this.query.set(query);
          this.hasError.set(false);

          if (query.length < this.minSearchLength) {
            this.results.set([]);
            this.isLoading.set(false);
          }
        }),
        switchMap((query) => {
          if (query.length < this.minSearchLength) {
            return of<Media[]>([]);
          }

          this.isLoading.set(true);

          return this.tmdbService.searchMedia(query).pipe(
            map((response) => response.results),
            catchError(() => {
              this.hasError.set(true);
              return of<Media[]>([]);
            }),
            finalize(() => {
              this.isLoading.set(false);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((results) => {
        this.results.set(results);
      });
  }
}
