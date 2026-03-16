import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MovieCard } from './movie-card';
import { Movie } from '../../models/Movie';

describe('MovieCard', () => {
  let component: MovieCard;
  let fixture: ComponentFixture<MovieCard>;
  const movie: Movie = {
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
    await TestBed.configureTestingModule({
      imports: [MovieCard],
      providers: [provideRouter([])]
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
});
