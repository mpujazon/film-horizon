import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where
} from '@angular/fire/firestore';
import { WatchlistService } from './watchlist-service';
import { AuthService } from '../auth/auth-service';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class Firestore {},
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  query: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
  where: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn()
}));

describe('WatchlistService', () => {
  let service: WatchlistService;
  let authServiceMock: { user: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();

    authServiceMock = {
      user: vi.fn(() => ({ uid: 'user-1' }))
    };

    TestBed.configureTestingModule({
      providers: [
        WatchlistService,
        { provide: Firestore, useValue: {} },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(WatchlistService);
    vi.mocked(serverTimestamp).mockReturnValue('server-ts' as never);
  });

  it('returns empty watchlist when there is no authenticated user', async () => {
    authServiceMock.user.mockReturnValue(null);

    const result = await service.getUserWatchlist();

    expect(result).toEqual([]);
    expect(getDocs).not.toHaveBeenCalled();
  });

  it('returns user watchlist items when firestore query succeeds', async () => {
    const itemA = { userId: 'user-1', tmdbId: 1, mediaType: 'movie', createdAt: new Date() };
    const itemB = { userId: 'user-1', tmdbId: 2, mediaType: 'tv', createdAt: new Date() };

    vi.mocked(collection).mockReturnValue('watchlist-collection' as never);
    vi.mocked(where).mockReturnValue('user-filter' as never);
    vi.mocked(query).mockReturnValue('query-ref' as never);
    vi.mocked(getDocs).mockResolvedValue({
      docs: [{ data: () => itemA }, { data: () => itemB }]
    } as never);

    const result = await service.getUserWatchlist();

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'user_watchlist');
    expect(where).toHaveBeenCalledWith('userId', '==', 'user-1');
    expect(query).toHaveBeenCalledWith('watchlist-collection', 'user-filter');
    expect(result).toEqual([itemA, itemB]);
  });

  it('saves an item to firestore when user is authenticated', async () => {
    vi.mocked(doc).mockReturnValue('doc-ref' as never);
    vi.mocked(setDoc).mockResolvedValue(undefined as never);

    await service.saveItem(123, 'movie');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'user_watchlist', 'user-1_movie_123');
    expect(setDoc).toHaveBeenCalledWith('doc-ref', {
      userId: 'user-1',
      tmdbId: 123,
      mediaType: 'movie',
      createdAt: 'server-ts'
    });
  });

  it('does not save item when there is no authenticated user', async () => {
    authServiceMock.user.mockReturnValue(null);

    await service.saveItem(123, 'movie');

    expect(doc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('deletes an item from firestore using user-based document id', async () => {
    vi.mocked(doc).mockReturnValue('doc-ref' as never);
    vi.mocked(deleteDoc).mockResolvedValue(undefined as never);

    await service.deleteItem(55, 'tv');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'user_watchlist', 'user-1_tv_55');
    expect(deleteDoc).toHaveBeenCalledWith('doc-ref');
  });

  it('returns watchlist status from document existence', async () => {
    vi.mocked(doc).mockReturnValue('doc-ref' as never);
    vi.mocked(getDoc).mockResolvedValue({ exists: () => true } as never);

    const existsResult = await service.isItemInUserWatchlist(10, 'movie');
    expect(existsResult).toBe(true);

    vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as never);
    const missingResult = await service.isItemInUserWatchlist(10, 'movie');
    expect(missingResult).toBe(false);
  });
});
