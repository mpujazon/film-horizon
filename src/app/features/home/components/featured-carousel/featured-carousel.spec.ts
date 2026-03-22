import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WatchlistService } from '../../../../core/services/watchlist/watchlist-service';
import { Media } from '../../../../shared/models/Media';

import { FeaturedCarousel } from './featured-carousel';

describe('FeaturedCarousel', () => {
  let component: FeaturedCarousel;
  let fixture: ComponentFixture<FeaturedCarousel>;
  const watchlistServiceMock: Pick<WatchlistService, 'isItemInUserWatchlist' | 'saveItem' | 'deleteItem'> = {
    isItemInUserWatchlist: () => Promise.resolve(false),
    saveItem: () => Promise.resolve(),
    deleteItem: () => Promise.resolve()
  };
  const movie: Media = {
    adult: false,
    backdrop_path: '/backdrop.jpg',
    id: 1,
    title: 'The Last Horizon',
    original_language: 'en',
    original_title: 'The Last Horizon',
    overview: 'A pilot chases a signal beyond known space.',
    poster_path: '/poster.jpg',
    media_type: 'movie',
    genre_ids: [12],
    popularity: 65,
    release_date: '2024-01-01',
    video: false,
    vote_average: 7.8,
    vote_count: 500
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCarousel],
      providers: [
        provideRouter([]),
        { provide: WatchlistService, useValue: watchlistServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movies', [movie]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
