import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';
import { TmdbService } from '../../../../core/services/tmdb-service';
import { MovieCard } from '../../../../shared/components/movie-card/movie-card';
import { Media } from '../../../../shared/models/Media';

interface SearchFilterState {
  query: string;
  genreIds: number[];
  minScore: number | null;
  year: number | null;
  trendingOnly: boolean;
}

interface GenreFilterOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-search-results',
  imports: [MovieCard],
  templateUrl: './search-results.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResults {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tmdbService = inject(TmdbService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly minSearchLength = 2;
  private readonly trendingPopularityThreshold = 50;

  readonly genreOptions: GenreFilterOption[] = [
    { id: 28, label: 'Action' },
    { id: 12, label: 'Adventure' },
    { id: 16, label: 'Animation' },
    { id: 35, label: 'Comedy' },
    { id: 80, label: 'Crime' },
    { id: 18, label: 'Drama' },
    { id: 27, label: 'Horror' },
    { id: 10749, label: 'Romance' },
    { id: 878, label: 'Sci-Fi' },
    { id: 53, label: 'Thriller' }
  ];
  readonly minScoreOptions: number[] = [5, 6, 7, 8, 9];

  readonly query = signal('');
  readonly results = signal<Media[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly selectedGenreIds = signal<number[]>([]);
  readonly minScore = signal<number | null>(null);
  readonly selectedYear = signal<number | null>(null);
  readonly trendingOnly = signal(false);
  readonly isFiltersExpanded = signal(true);

  readonly filteredResults = computed(() => {
    const genreIds = this.selectedGenreIds();
    const minScore = this.minScore();
    const selectedYear = this.selectedYear();
    const trendingOnly = this.trendingOnly();

    return this.results().filter((media) => {
      const matchesGenre =
        genreIds.length === 0 || genreIds.some((genreId) => media.genre_ids.includes(genreId));
      const matchesScore = minScore === null || media.vote_average >= minScore;
      const matchesYear = selectedYear === null || this.getMediaYear(media) === selectedYear;
      const matchesTrending =
        !trendingOnly || media.popularity >= this.trendingPopularityThreshold;

      return matchesGenre && matchesScore && matchesYear && matchesTrending;
    });
  });

  readonly hasValidQuery = computed(() => this.query().length >= this.minSearchLength);
  readonly hasResults = computed(() => this.filteredResults().length > 0);
  readonly hasApiResults = computed(() => this.results().length > 0);
  readonly hasActiveFilters = computed(
    () =>
      this.selectedGenreIds().length > 0 ||
      this.minScore() !== null ||
      this.selectedYear() !== null ||
      this.trendingOnly()
  );
  readonly activeFilterCount = computed(() => {
    let count = 0;

    if (this.selectedGenreIds().length > 0) {
      count += 1;
    }

    if (this.minScore() !== null) {
      count += 1;
    }

    if (this.selectedYear() !== null) {
      count += 1;
    }

    if (this.trendingOnly()) {
      count += 1;
    }

    return count;
  });
  readonly selectedGenreLabels = computed(() => {
    const selectedGenres = new Set(this.selectedGenreIds());

    return this.genreOptions
      .filter((genre) => selectedGenres.has(genre.id))
      .map((genre) => genre.label);
  });
  readonly yearOptions = computed(() => {
    const uniqueYears = new Set<number>();

    for (const media of this.results()) {
      const year = this.getMediaYear(media);

      if (year !== null) {
        uniqueYears.add(year);
      }
    }

    return [...uniqueYears].sort((a, b) => b - a);
  });

  constructor() {
    this.bindQueryParamSearch();
  }

  private bindQueryParamSearch(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => this.getFiltersFromQueryParams(params)),
        distinctUntilChanged((previous, current) => this.isSameFilterState(previous, current)),
        tap((state) => {
          this.query.set(state.query);
          this.selectedGenreIds.set(state.genreIds);
          this.minScore.set(state.minScore);
          this.selectedYear.set(state.year);
          this.trendingOnly.set(state.trendingOnly);
          this.hasError.set(false);

          if (state.query.length < this.minSearchLength) {
            this.results.set([]);
            this.isLoading.set(false);
          }
        }),
        switchMap((state) => {
          if (state.query.length < this.minSearchLength) {
            return of<Media[]>([]);
          }

          this.isLoading.set(true);

          return this.tmdbService.searchMedia(state.query).pipe(
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

  isGenreSelected(genreId: number): boolean {
    return this.selectedGenreIds().includes(genreId);
  }

  onGenreToggle(genreId: number, event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const currentGenres = this.selectedGenreIds();
    const nextGenres = input.checked
      ? [...currentGenres, genreId]
      : currentGenres.filter((id) => id !== genreId);

    this.selectedGenreIds.set([...new Set(nextGenres)].sort((a, b) => a - b));
    this.persistFiltersInQueryParams();
  }

  onMinScoreChange(event: Event): void {
    const select = event.target;

    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    const parsedValue = Number.parseFloat(select.value);
    this.minScore.set(Number.isFinite(parsedValue) ? parsedValue : null);
    this.persistFiltersInQueryParams();
  }

  onYearChange(event: Event): void {
    const select = event.target;

    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    const parsedValue = Number.parseInt(select.value, 10);
    this.selectedYear.set(Number.isFinite(parsedValue) ? parsedValue : null);
    this.persistFiltersInQueryParams();
  }

  onTrendingChange(event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    this.trendingOnly.set(input.checked);
    this.persistFiltersInQueryParams();
  }

  clearFilters(): void {
    this.selectedGenreIds.set([]);
    this.minScore.set(null);
    this.selectedYear.set(null);
    this.trendingOnly.set(false);
    this.persistFiltersInQueryParams();
  }

  toggleFiltersExpanded(): void {
    this.isFiltersExpanded.update((expanded) => !expanded);
  }

  private getFiltersFromQueryParams(params: ParamMap): SearchFilterState {
    return {
      query: (params.get('q') ?? '').trim(),
      genreIds: this.parseGenreIds(params.get('genre')),
      minScore: this.parseNumberParam(params.get('score'), { min: 0, max: 10 }),
      year: this.parseNumberParam(params.get('year'), { min: 1900, max: 2100 }),
      trendingOnly: params.get('trending') === 'true'
    };
  }

  private isSameFilterState(previous: SearchFilterState, current: SearchFilterState): boolean {
    if (
      previous.query !== current.query ||
      previous.minScore !== current.minScore ||
      previous.year !== current.year ||
      previous.trendingOnly !== current.trendingOnly ||
      previous.genreIds.length !== current.genreIds.length
    ) {
      return false;
    }

    return previous.genreIds.every((genreId, index) => genreId === current.genreIds[index]);
  }

  private parseGenreIds(value: string | null): number[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((entry) => Number.parseInt(entry, 10))
      .filter((entry) => Number.isFinite(entry) && entry > 0);
  }

  private parseNumberParam(
    value: string | null,
    bounds: { min: number; max: number }
  ): number | null {
    if (!value) {
      return null;
    }

    const parsedValue = Number.parseFloat(value);

    if (!Number.isFinite(parsedValue) || parsedValue < bounds.min || parsedValue > bounds.max) {
      return null;
    }

    return parsedValue;
  }

  private getMediaYear(media: Media): number | null {
    const dateValue = media.release_date || media.first_air_date;

    if (!dateValue) {
      return null;
    }

    const year = Number.parseInt(dateValue.slice(0, 4), 10);
    return Number.isFinite(year) ? year : null;
  }

  private persistFiltersInQueryParams(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        genre: this.selectedGenreIds().length > 0 ? this.selectedGenreIds().join(',') : null,
        score: this.minScore() !== null ? this.minScore() : null,
        year: this.selectedYear() !== null ? this.selectedYear() : null,
        trending: this.trendingOnly() ? 'true' : null
      }
    });
  }
}
