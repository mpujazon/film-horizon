import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { WatchlistService } from './watchlist-service';
import { AuthService } from '../auth/auth-service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let authServiceMock: { user: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      user: vi.fn(() => null)
    };

    TestBed.configureTestingModule({
      providers: [
        WatchlistService,
        { provide: Firestore, useValue: {} },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(WatchlistService);
  });

  it('returns an empty watchlist when there is no authenticated user', async () => {
    const result = await service.getUserWatchlist();

    expect(result).toEqual([]);
  });

  it('does nothing when saving without an authenticated user', async () => {
    await expect(service.saveItem(123, 'movie')).resolves.toBeUndefined();
  });

  it('does nothing when deleting without an authenticated user', async () => {
    await expect(service.deleteItem(123, 'tv')).resolves.toBeUndefined();
  });

  it('returns false when checking an item without an authenticated user', async () => {
    const result = await service.isItemInUserWatchlist(123, 'movie');

    expect(result).toBe(false);
  });
});
