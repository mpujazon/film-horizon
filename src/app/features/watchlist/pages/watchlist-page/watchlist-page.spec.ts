import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { WatchlistPage } from './watchlist-page';
import { WatchlistService } from '../../../../core/services/watchlist/watchlist-service';
import { TmdbService } from '../../../../core/services/tmdb/tmdb-service';
import { MediaDetail } from '../../../../shared/models/MediaDetail';

describe('WatchlistPage', () => {
  let fixture: ComponentFixture<WatchlistPage>;
  let component: WatchlistPage;
  let watchlistServiceMock: { getUserWatchlist: ReturnType<typeof vi.fn> };
  let tmdbServiceMock: { getMediaDetail: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    watchlistServiceMock = {
      getUserWatchlist: vi.fn().mockResolvedValue([])
    };

    tmdbServiceMock = {
      getMediaDetail: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [WatchlistPage],
      providers: [
        { provide: WatchlistService, useValue: watchlistServiceMock },
        { provide: TmdbService, useValue: tmdbServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistPage);
    component = fixture.componentInstance;
  });

  it('loads empty watchlist state', async () => {
    await component.loadWatchlist();

    expect(watchlistServiceMock.getUserWatchlist).toHaveBeenCalledTimes(1);
    expect(component.hasError()).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(component.items()).toEqual([]);
    expect(component.hasItems()).toBe(false);
    expect(component.totalItems()).toBe(0);
  });

  it('loads watchlist details and maps them into media items', async () => {
    watchlistServiceMock.getUserWatchlist.mockResolvedValue([
      { userId: 'u1', tmdbId: 10, mediaType: 'movie', createdAt: new Date() },
      { userId: 'u1', tmdbId: 20, mediaType: 'tv', createdAt: new Date() }
    ]);

    const movieDetail = createDetail({
      id: 10,
      media_type: 'movie',
      title: 'Interstellar',
      release_date: '2014-11-07'
    });
    const tvDetail = createDetail({
      id: 20,
      media_type: 'tv',
      name: 'Dark',
      first_air_date: '2017-12-01'
    });

    tmdbServiceMock.getMediaDetail
      .mockReturnValueOnce(of(movieDetail))
      .mockReturnValueOnce(of(tvDetail));

    await component.loadWatchlist();

    expect(tmdbServiceMock.getMediaDetail).toHaveBeenNthCalledWith(1, 'movie', 10);
    expect(tmdbServiceMock.getMediaDetail).toHaveBeenNthCalledWith(2, 'tv', 20);
    expect(component.items().length).toBe(2);
    expect(component.items()[0].title).toBe('Interstellar');
    expect(component.items()[1].title).toBe('Dark');
    expect(component.items()[1].media_type).toBe('tv');
    expect(component.hasItems()).toBe(true);
    expect(component.totalItems()).toBe(2);
  });

  it('filters out media entries when detail request fails', async () => {
    watchlistServiceMock.getUserWatchlist.mockResolvedValue([
      { userId: 'u1', tmdbId: 10, mediaType: 'movie', createdAt: new Date() },
      { userId: 'u1', tmdbId: 20, mediaType: 'tv', createdAt: new Date() }
    ]);

    const movieDetail = createDetail({ id: 10, media_type: 'movie', title: 'Kept item' });

    tmdbServiceMock.getMediaDetail
      .mockReturnValueOnce(of(movieDetail))
      .mockReturnValueOnce(throwError(() => new Error('tmdb error')));

    await component.loadWatchlist();

    expect(component.items().length).toBe(1);
    expect(component.items()[0].id).toBe(10);
  });

  it('sets error state when watchlist request fails', async () => {
    watchlistServiceMock.getUserWatchlist.mockRejectedValue(new Error('firestore down'));

    await component.loadWatchlist();

    expect(component.hasError()).toBe(true);
    expect(component.items()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });

  it('removes item when watchlistChanged emits removal', () => {
    component.items.set([
      {
        adult: false,
        backdrop_path: null,
        id: 1,
        title: 'Keep',
        original_language: 'en',
        original_title: 'Keep',
        overview: '',
        poster_path: null,
        media_type: 'movie',
        genre_ids: [],
        popularity: 0,
        release_date: '',
        video: false,
        vote_average: 0,
        vote_count: 0
      },
      {
        adult: false,
        backdrop_path: null,
        id: 2,
        title: 'Remove',
        original_language: 'en',
        original_title: 'Remove',
        overview: '',
        poster_path: null,
        media_type: 'tv',
        genre_ids: [],
        popularity: 0,
        release_date: '',
        video: false,
        vote_average: 0,
        vote_count: 0
      }
    ]);

    component.onItemWatchlistChanged({ mediaId: 2, mediaType: 'tv', isInWatchlist: false });

    expect(component.items().length).toBe(1);
    expect(component.items()[0].id).toBe(1);
  });

  it('keeps list unchanged when watchlistChanged indicates item still saved', () => {
    component.items.set([
      {
        adult: false,
        backdrop_path: null,
        id: 1,
        title: 'Only item',
        original_language: 'en',
        original_title: 'Only item',
        overview: '',
        poster_path: null,
        media_type: 'movie',
        genre_ids: [],
        popularity: 0,
        release_date: '',
        video: false,
        vote_average: 0,
        vote_count: 0
      }
    ]);

    component.onItemWatchlistChanged({ mediaId: 1, mediaType: 'movie', isInWatchlist: true });

    expect(component.items().length).toBe(1);
    expect(component.items()[0].id).toBe(1);
  });
});

function createDetail(
  overrides: Partial<MediaDetail> & Pick<MediaDetail, 'id' | 'media_type'>
): MediaDetail {
  return {
    id: overrides.id,
    media_type: overrides.media_type,
    overview: overrides.overview ?? 'overview',
    tagline: overrides.tagline ?? '',
    status: overrides.status ?? 'Released',
    backdrop_path: overrides.backdrop_path ?? null,
    poster_path: overrides.poster_path ?? null,
    vote_average: overrides.vote_average ?? 7.5,
    vote_count: overrides.vote_count ?? 100,
    genres: overrides.genres ?? [],
    title: overrides.title,
    name: overrides.name,
    release_date: overrides.release_date,
    first_air_date: overrides.first_air_date,
    runtime: overrides.runtime,
    episode_run_time: overrides.episode_run_time,
    number_of_seasons: overrides.number_of_seasons,
    created_by: overrides.created_by,
    credits: overrides.credits,
    videos: overrides.videos
  };
}
