import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  output,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, of, switchMap, tap } from 'rxjs';
import { TmdbService } from '../../../../core/services/tmdb-service';
import { Media } from '../../../../shared/models/Media';
import { API_CONFIG } from '../../../../core/config/api.config';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './search-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative block',
    '(focusout)': 'onFocusOut($event)'
  }
})
export class SearchBar {
  private readonly tmdbService = inject(TmdbService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly minSearchLength = 2;
  private readonly debounceDurationMs = 350;
  private readonly imageBaseUrl = API_CONFIG.tmdbImageBaseUrl;

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly resultSelected = output<Media>();

  readonly query = signal('');
  readonly results = signal<Media[]>([]);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly isPanelOpen = signal(false);

  readonly hasResults = computed(() => this.results().length > 0);
  readonly showNoResults = computed(
    () =>
      this.query().length >= this.minSearchLength &&
      !this.isLoading() &&
      !this.hasError() &&
      this.results().length === 0
  );
  readonly showPanel = computed(
    () =>
      this.isPanelOpen() &&
      this.query().length >= this.minSearchLength &&
      (this.isLoading() || this.hasError() || this.showNoResults() || this.hasResults())
  );

  constructor() {
    this.bindSearchStream();
  }

  openPanel(): void {
    if (this.query().length >= this.minSearchLength) {
      this.isPanelOpen.set(true);
    }
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
  }

  onFocusOut(event: FocusEvent): void {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && this.elementRef.nativeElement.contains(nextFocusedElement)) {
      return;
    }

    this.closePanel();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.query.set('');
    this.results.set([]);
    this.hasError.set(false);
    this.isLoading.set(false);
    this.closePanel();
  }

  selectResult(result: Media): void {
    this.searchControl.setValue(this.getResultTitle(result), { emitEvent: false });
    this.query.set(this.getResultTitle(result));
    this.isPanelOpen.set(false);
    this.resultSelected.emit(result);
  }

  getResultTitle(result: Media): string {
    return result.title || result.name || 'Untitled';
  }

  getReleaseDate(result: Media): string {
    return result.release_date || result.first_air_date || '';
  }

  getPosterUrl(result: Media): string {
    const imagePath = result.poster_path || result.backdrop_path;
    return imagePath ? `${this.imageBaseUrl}/w185${imagePath}` : '';
  }

  private bindSearchStream(): void {
    this.searchControl.valueChanges
      .pipe(
        map((value) => value.trim()),
        tap((query) => {
          this.query.set(query);
          this.hasError.set(false);

          if (query.length < this.minSearchLength) {
            this.results.set([]);
            this.isLoading.set(false);
            this.isPanelOpen.set(false);
          }
        }),
        debounceTime(this.debounceDurationMs),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length < this.minSearchLength) {
            return of<Media[]>([]);
          }

          this.isLoading.set(true);

          return this.tmdbService.searchMedia(query).pipe(
            map((response) => response.results.slice(0, 7)),
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
        this.isPanelOpen.set(this.query().length >= this.minSearchLength);
      });
  }

}
