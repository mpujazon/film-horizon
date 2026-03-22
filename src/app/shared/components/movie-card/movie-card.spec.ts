import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MovieCard } from './movie-card';
import { TmdbService } from '../../../core/services/tmdb/tmdb-service';
import { Media } from '../../models/Media';
import { MediaDetail, MediaVideo } from '../../models/MediaDetail';

describe('MovieCard', () => {
  let component: MovieCard;
  let fixture: ComponentFixture<MovieCard>;
  let lastGetMediaDetailArgs: ['movie' | 'tv', number] | null = null;
  const tmdbServiceMock: Pick<TmdbService, 'getMediaDetail'> = {
    getMediaDetail: (mediaType, mediaId) => {
      lastGetMediaDetailArgs = [mediaType, mediaId];
      return of(createDetailResponse([]));
    }
  };
  const movie: Media = {
    adult: false,
    backdrop_path: '/backdrop.jpg',
    id: 123,
    title: 'Blade Runner',
    original_language: 'en',
    original_title: 'Blade Runner',
    overview: 'Neo-noir sci-fi mystery.',
    poster_path: '/poster.jpg',
    media_type: 'movie',
    genre_ids: [878, 53],
    popularity: 99,
    release_date: '1982-06-25',
    video: false,
    vote_average: 8.1,
    vote_count: 12345
  };

  beforeEach(async () => {
    lastGetMediaDetailArgs = null;

    await TestBed.configureTestingModule({
      imports: [MovieCard],
      providers: [
        provideRouter([]),
        { provide: TmdbService, useValue: tmdbServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movie', movie);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open trailer in a new tab when available', () => {
    tmdbServiceMock.getMediaDetail = (mediaType, mediaId) => {
      lastGetMediaDetailArgs = [mediaType, mediaId];
      return of(createDetailResponse([{ ...defaultVideo, key: 'abc123', official: true }]));
    };

    const originalWindowOpen = window.open;
    let openedUrl: string | null = null;
    let openedTarget: string | undefined;
    let openedFeatures: string | undefined;

    window.open = ((url?: string | URL, target?: string, features?: string) => {
      openedUrl = typeof url === 'string' ? url : (url?.toString() ?? null);
      openedTarget = target;
      openedFeatures = features;
      return null;
    }) as typeof window.open;

    try {
      component.onTrailerClick();
    } finally {
      window.open = originalWindowOpen;
    }

    expect(lastGetMediaDetailArgs).toEqual(['movie', movie.id]);
    expect(openedUrl).toBe('https://www.youtube.com/watch?v=abc123');
    expect(openedTarget).toBe('_blank');
    expect(openedFeatures).toBe('noopener,noreferrer');
  });

  it('should not open a tab when no trailer is returned', () => {
    tmdbServiceMock.getMediaDetail = (mediaType, mediaId) => {
      lastGetMediaDetailArgs = [mediaType, mediaId];
      return of(createDetailResponse([]));
    };

    const originalWindowOpen = window.open;
    let openCalls = 0;

    window.open = (() => {
      openCalls += 1;
      return null;
    }) as typeof window.open;

    try {
      component.onTrailerClick();
    } finally {
      window.open = originalWindowOpen;
    }

    expect(lastGetMediaDetailArgs).toEqual(['movie', movie.id]);
    expect(openCalls).toBe(0);
  });
});

const defaultVideo: MediaVideo = {
  id: 'video-1',
  key: 'key',
  name: 'Trailer',
  site: 'YouTube',
  type: 'Trailer',
  official: false,
  published_at: '2024-01-01T00:00:00.000Z'
};

function createDetailResponse(videos: MediaVideo[]): MediaDetail {
  return {
    id: 123,
    title: 'Blade Runner',
    overview: 'Neo-noir sci-fi mystery.',
    tagline: '',
    status: 'Released',
    backdrop_path: '/backdrop.jpg',
    poster_path: '/poster.jpg',
    vote_average: 8.1,
    vote_count: 12345,
    genres: [],
    media_type: 'movie',
    videos: { results: videos }
  };
}
