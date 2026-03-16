import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TmdbService } from '../../../../core/services/tmdb-service';

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  const tmdbServiceMock = {
    searchMedia: () =>
      of({
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0
      })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar],
      providers: [{ provide: TmdbService, useValue: tmdbServiceMock }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
