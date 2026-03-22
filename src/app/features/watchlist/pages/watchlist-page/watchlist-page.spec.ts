import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TmdbService } from '../../../../core/services/tmdb/tmdb-service';
import { WatchlistService } from '../../../../core/services/watchlist/watchlist-service';

import { WatchlistPage } from './watchlist-page';

describe('WatchlistPage', () => {
  let component: WatchlistPage;
  let fixture: ComponentFixture<WatchlistPage>;

  beforeEach(async () => {
    const watchlistServiceMock: Pick<WatchlistService, 'getUserWatchlist' | 'deleteItem'> = {
      getUserWatchlist: () => Promise.resolve([]),
      deleteItem: () => Promise.resolve()
    };

    const tmdbServiceMock: Pick<TmdbService, 'getMediaDetail'> = {
      getMediaDetail: () => of(createMediaDetailMock())
    };

    await TestBed.configureTestingModule({
      imports: [WatchlistPage],
      providers: [
        provideRouter([]),
        { provide: WatchlistService, useValue: watchlistServiceMock },
        { provide: TmdbService, useValue: tmdbServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchlistPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createMediaDetailMock() {
  return {
    id: 1,
    title: 'Sample',
    overview: 'Sample overview',
    tagline: '',
    status: 'Released',
    backdrop_path: null,
    poster_path: null,
    vote_average: 0,
    vote_count: 0,
    genres: [],
    media_type: 'movie' as const
  };
}
