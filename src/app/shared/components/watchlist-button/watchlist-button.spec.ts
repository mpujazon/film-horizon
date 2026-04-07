import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { WatchlistButton } from './watchlist-button';
import { WatchlistService } from '../../../core/services/watchlist/watchlist-service';

describe('WatchlistButton', () => {
  let fixture: ComponentFixture<WatchlistButton>;
  let component: WatchlistButton;
  let watchlistServiceMock: {
    saveItem: ReturnType<typeof vi.fn>;
    deleteItem: ReturnType<typeof vi.fn>;
    isItemInUserWatchlist: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    watchlistServiceMock = {
      saveItem: vi.fn().mockResolvedValue(undefined),
      deleteItem: vi.fn().mockResolvedValue(undefined),
      isItemInUserWatchlist: vi.fn().mockResolvedValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [WatchlistButton],
      providers: [{ provide: WatchlistService, useValue: watchlistServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mediaId', 101);
    fixture.componentRef.setInput('mediaType', 'movie');
    fixture.componentRef.setInput('mediaTitle', 'Inception');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('syncs initial watchlist status from service', () => {
    expect(watchlistServiceMock.isItemInUserWatchlist).toHaveBeenCalledWith(101, 'movie');
    expect(component.isInWatchlist()).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(component.hasError()).toBe(false);
  });

  it('adds item to watchlist and emits change event', async () => {
    const emitSpy = vi.fn();
    component.changed.subscribe((event) => emitSpy(event));

    await component.toggleWatchlist();

    expect(watchlistServiceMock.saveItem).toHaveBeenCalledWith(101, 'movie');
    expect(component.isInWatchlist()).toBe(true);
    expect(component.hasError()).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith({ mediaId: 101, mediaType: 'movie', isInWatchlist: true });
  });

  it('removes item from watchlist when currently saved', async () => {
    component.isInWatchlist.set(true);
    const emitSpy = vi.fn();
    component.changed.subscribe((event) => emitSpy(event));

    await component.toggleWatchlist();

    expect(watchlistServiceMock.deleteItem).toHaveBeenCalledWith(101, 'movie');
    expect(component.isInWatchlist()).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith({ mediaId: 101, mediaType: 'movie', isInWatchlist: false });
  });

  it('sets error state when save fails', async () => {
    watchlistServiceMock.saveItem.mockRejectedValue(new Error('save failed'));

    await component.toggleWatchlist();

    expect(component.hasError()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('updates labels for compact variant', () => {
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();

    expect(component.label()).toBe('Watchlist');
    expect(component.ariaLabel()).toBe('Add Inception to watchlist');

    component.isInWatchlist.set(true);
    expect(component.label()).toBe('Saved');
    expect(component.ariaLabel()).toBe('Remove Inception from watchlist');
  });

  it('ignores stale sync result when inputs change quickly', async () => {
    let resolveFirst: ((value: boolean) => void) | undefined;
    const firstPromise = new Promise<boolean>((resolve) => {
      resolveFirst = resolve;
    });

    watchlistServiceMock.isItemInUserWatchlist
      .mockReset()
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce(false);

    fixture.componentRef.setInput('mediaId', 201);
    fixture.detectChanges();
    fixture.componentRef.setInput('mediaId', 202);
    fixture.detectChanges();

    resolveFirst?.(true);
    await fixture.whenStable();

    expect(component.isInWatchlist()).toBe(false);
    expect(component.isLoading()).toBe(false);
  });
});
