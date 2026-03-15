import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCarousel } from './featured-carousel';

describe('FeaturedCarousel', () => {
  let component: FeaturedCarousel;
  let fixture: ComponentFixture<FeaturedCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedCarousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
