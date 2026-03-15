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
    fixture.componentRef.setInput('title', 'The Last Horizon');
    fixture.componentRef.setInput('description', 'A pilot chases a signal beyond known space.');
    fixture.componentRef.setInput('imageUrl', 'https://image.tmdb.org/t/p/original/backdrop.jpg');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
