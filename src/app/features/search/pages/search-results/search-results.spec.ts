import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SearchResults } from './search-results';
import { TmdbService } from '../../../../core/services/tmdb/tmdb-service';
import { Media } from '../../../../shared/models/Media';
import { WatchlistService } from '../../../../core/services/watchlist/watchlist-service';

describe('SearchResults', () => {
  let fixture: ComponentFixture<SearchResults>;
  let component: SearchResults;
  let queryParamMap$: BehaviorSubject<ParamMap>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let tmdbServiceMock: { searchMedia: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject<ParamMap>(convertToParamMap({ q: '' }));
    routerMock = {
      navigate: vi.fn().mockResolvedValue(true)
    };
    tmdbServiceMock = {
      searchMedia: vi.fn().mockReturnValue(
        of({ page: 1, total_pages: 1, total_results: 1, results: [createMedia({ id: 1, title: 'Result A' })] })
      )
    };

    await TestBed.configureTestingModule({
      imports: [SearchResults],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } },
        { provide: Router, useValue: routerMock },
        { provide: TmdbService, useValue: tmdbServiceMock },
        {
          provide: WatchlistService,
          useValue: {
            isItemInUserWatchlist: vi.fn().mockResolvedValue(false),
            saveItem: vi.fn().mockResolvedValue(undefined),
            deleteItem: vi.fn().mockResolvedValue(undefined)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('does not call API when query has less than 2 characters', async () => {
    queryParamMap$.next(convertToParamMap({ q: 'a' }));
    await fixture.whenStable();

    expect(tmdbServiceMock.searchMedia).not.toHaveBeenCalled();
    expect(component.hasValidQuery()).toBe(false);
    expect(component.results()).toEqual([]);
  });

  it('loads results from query params when query is valid', async () => {
    queryParamMap$.next(convertToParamMap({ q: 'matrix' }));
    await fixture.whenStable();

    expect(tmdbServiceMock.searchMedia).toHaveBeenCalledWith('matrix');
    expect(component.query()).toBe('matrix');
    expect(component.results().length).toBe(1);
    expect(component.hasValidQuery()).toBe(true);
    expect(component.hasApiResults()).toBe(true);
  });

  it('sets error state when API request fails', async () => {
    tmdbServiceMock.searchMedia.mockReturnValueOnce(throwError(() => new Error('api failed')));

    queryParamMap$.next(convertToParamMap({ q: 'broken' }));
    await fixture.whenStable();

    expect(component.hasError()).toBe(true);
    expect(component.results()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });

  it('applies filters from query params and computes filtered results', async () => {
    const matching = createMedia({
      id: 10,
      title: 'Match',
      genre_ids: [28],
      vote_average: 8,
      release_date: '2020-01-01',
      popularity: 80
    });
    const nonMatching = createMedia({
      id: 11,
      title: 'Nope',
      genre_ids: [35],
      vote_average: 6,
      release_date: '2018-05-01',
      popularity: 20
    });

    tmdbServiceMock.searchMedia.mockReturnValueOnce(
      of({ page: 1, total_pages: 1, total_results: 2, results: [matching, nonMatching] })
    );

    queryParamMap$.next(
      convertToParamMap({
        q: 'mix',
        genre: '28',
        score: '7',
        year: '2020',
        trending: 'true'
      })
    );
    await fixture.whenStable();

    expect(component.selectedGenreIds()).toEqual([28]);
    expect(component.minScore()).toBe(7);
    expect(component.selectedYear()).toBe(2020);
    expect(component.trendingOnly()).toBe(true);
    expect(component.filteredResults().map((media) => media.id)).toEqual([10]);
    expect(component.activeFilterCount()).toBe(4);
  });

  it('persists genre and score filter changes to query params', () => {
    component.onGenreToggle(28, checkboxEvent(true));
    component.onMinScoreChange(selectEvent('8'));

    expect(component.isGenreSelected(28)).toBe(true);
    expect(component.minScore()).toBe(8);
    expect(routerMock.navigate).toHaveBeenCalled();

    const lastCall = routerMock.navigate.mock.calls.at(-1);
    expect(lastCall?.[1]).toMatchObject({
      queryParamsHandling: 'merge',
      queryParams: {
        genre: '28',
        score: 8,
        year: null,
        trending: null
      }
    });
  });

  it('clears all filters and collapses filter panel toggle state', () => {
    component.selectedGenreIds.set([28, 35]);
    component.minScore.set(7);
    component.selectedYear.set(2024);
    component.trendingOnly.set(true);

    component.clearFilters();
    component.toggleFiltersExpanded();

    expect(component.selectedGenreIds()).toEqual([]);
    expect(component.minScore()).toBeNull();
    expect(component.selectedYear()).toBeNull();
    expect(component.trendingOnly()).toBe(false);
    expect(component.isFiltersExpanded()).toBe(false);
  });
});

function createMedia(overrides: Partial<Media> = {}): Media {
  return {
    adult: false,
    backdrop_path: null,
    id: overrides.id ?? 1,
    title: overrides.title ?? 'Title',
    original_language: overrides.original_language ?? 'en',
    original_title: overrides.original_title ?? (overrides.title ?? 'Title'),
    overview: overrides.overview ?? '',
    poster_path: overrides.poster_path ?? null,
    media_type: overrides.media_type ?? 'movie',
    genre_ids: overrides.genre_ids ?? [],
    popularity: overrides.popularity ?? 0,
    release_date: overrides.release_date ?? '',
    video: overrides.video ?? false,
    vote_average: overrides.vote_average ?? 0,
    vote_count: overrides.vote_count ?? 0,
    name: overrides.name,
    first_air_date: overrides.first_air_date
  };
}

function checkboxEvent(checked: boolean): Event {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: input });
  return event;
}

function selectEvent(value: string): Event {
  const select = document.createElement('select');
  const option = document.createElement('option');
  option.value = value;
  select.appendChild(option);
  select.value = value;
  const event = new Event('change');
  Object.defineProperty(event, 'target', { value: select });
  return event;
}
