import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TmdbService } from './tmdb-service';
import { API_CONFIG } from '../../config/api.config';
import { MediaListResponse } from '../../../shared/models/PaginatedResponse';
import { MediaDetail } from '../../../shared/models/MediaDetail';
import { ActorDetail } from '../../../shared/models/ActorDetail';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets trending media and filters out unsupported media types', () => {
    const apiResponse: MediaListResponse = {
      page: 1,
      total_pages: 10,
      total_results: 3,
      results: [
        {
          adult: false,
          backdrop_path: null,
          id: 100,
          title: 'Movie Item',
          original_language: 'en',
          original_title: 'Movie Item',
          overview: 'movie',
          poster_path: null,
          media_type: 'movie',
          genre_ids: [],
          popularity: 100,
          release_date: '2025-01-01',
          video: false,
          vote_average: 8.2,
          vote_count: 20
        },
        {
          adult: false,
          backdrop_path: null,
          id: 101,
          title: '',
          name: 'TV Item',
          original_language: 'en',
          original_title: '',
          overview: 'tv',
          poster_path: null,
          media_type: 'tv',
          genre_ids: [],
          popularity: 90,
          release_date: '',
          first_air_date: '2024-09-01',
          video: false,
          vote_average: 7.8,
          vote_count: 15
        },
        {
          adult: false,
          backdrop_path: null,
          id: 102,
          title: 'Person Item',
          original_language: 'en',
          original_title: 'Person Item',
          overview: 'person',
          poster_path: null,
          media_type: 'movie',
          genre_ids: [],
          popularity: 50,
          release_date: '2020-01-01',
          video: false,
          vote_average: 6.1,
          vote_count: 4
        }
      ]
    };

    let result: MediaListResponse | undefined;
    service.getTrendingMedia().subscribe((value) => {
      result = value;
    });

    const req = httpMock.expectOne(`${API_CONFIG.tmdbBaseUrl}/trending/all/week?page=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${API_CONFIG.tmdbApiKey}`);

    req.flush({
      ...apiResponse,
      results: [apiResponse.results[0], apiResponse.results[1], { ...apiResponse.results[2], media_type: 'person' }]
    });

    expect(result).toBeDefined();
    expect(result?.results.length).toBe(2);
    expect(result?.results.map((item) => item.media_type)).toEqual(['movie', 'tv']);
  });

  it('searches media with query params and filters media types', () => {
    const apiResponse: MediaListResponse = {
      page: 2,
      total_pages: 5,
      total_results: 2,
      results: [
        {
          adult: false,
          backdrop_path: null,
          id: 201,
          title: 'Search Movie',
          original_language: 'en',
          original_title: 'Search Movie',
          overview: '',
          poster_path: null,
          media_type: 'movie',
          genre_ids: [],
          popularity: 70,
          release_date: '2024-01-01',
          video: false,
          vote_average: 7,
          vote_count: 10
        },
        {
          adult: false,
          backdrop_path: null,
          id: 202,
          title: 'Person Result',
          original_language: 'en',
          original_title: 'Person Result',
          overview: '',
          poster_path: null,
          media_type: 'movie',
          genre_ids: [],
          popularity: 40,
          release_date: '2023-01-01',
          video: false,
          vote_average: 6,
          vote_count: 2
        }
      ]
    };

    let result: MediaListResponse | undefined;
    service.searchMedia('matrix', 2).subscribe((value) => {
      result = value;
    });

    const req = httpMock.expectOne(
      `${API_CONFIG.tmdbBaseUrl}/search/multi?query=matrix&page=2&include_adult=false`
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      ...apiResponse,
      results: [apiResponse.results[0], { ...apiResponse.results[1], media_type: 'person' }]
    });

    expect(result).toBeDefined();
    expect(result?.results.length).toBe(1);
    expect(result?.results[0].id).toBe(201);
  });

  it('gets media detail and sets media_type from method argument', () => {
    const detail: MediaDetail = {
      id: 300,
      title: 'Detail',
      overview: 'overview',
      tagline: 'tagline',
      status: 'Released',
      backdrop_path: null,
      poster_path: null,
      runtime: 120,
      vote_average: 8.4,
      vote_count: 300,
      genres: [{ id: 1, name: 'Action' }],
      media_type: 'movie'
    };

    let result: MediaDetail | undefined;
    service.getMediaDetail('tv', 300).subscribe((value) => {
      result = value;
    });

    const req = httpMock.expectOne(
      `${API_CONFIG.tmdbBaseUrl}/tv/300?append_to_response=credits,videos`
    );
    expect(req.request.method).toBe('GET');

    req.flush(detail);

    expect(result).toBeDefined();
    expect(result?.id).toBe(300);
    expect(result?.media_type).toBe('tv');
  });

  it('gets actor detail with combined credits append parameter', () => {
    const actor: ActorDetail = {
      id: 400,
      name: 'Actor Name',
      biography: '',
      profile_path: null,
      known_for_department: 'Acting',
      birthday: null,
      deathday: null,
      place_of_birth: null,
      popularity: 10,
      combined_credits: { cast: [] }
    };

    let result: ActorDetail | undefined;
    service.getActorDetail(400).subscribe((value) => {
      result = value;
    });

    const req = httpMock.expectOne(
      `${API_CONFIG.tmdbBaseUrl}/person/400?append_to_response=combined_credits`
    );
    expect(req.request.method).toBe('GET');
    req.flush(actor);

    expect(result).toEqual(actor);
  });
});
