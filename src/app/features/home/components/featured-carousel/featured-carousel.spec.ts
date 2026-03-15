import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FeaturedCarousel } from './featured-carousel';

describe('FeaturedCarousel', () => {
  let component: FeaturedCarousel;
  let fixture: ComponentFixture<FeaturedCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCarousel],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movies', [
      {
        title: 'The Last Horizon',
        description: 'A pilot chases a signal beyond known space.',
        imageUrl: 'https://image.tmdb.org/t/p/original/backdrop.jpg',
        movieId: 1
      }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
