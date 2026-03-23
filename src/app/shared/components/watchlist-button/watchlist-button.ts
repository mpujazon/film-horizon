import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { WatchlistService } from '../../../core/services/watchlist/watchlist-service';
import { MediaType } from '../../models/UserData';

export type WatchlistButtonVariant = 'icon' | 'compact' | 'pill';

export interface WatchlistChangeEvent {
  mediaId: number;
  mediaType: MediaType;
  isInWatchlist: boolean;
}

@Component({
  selector: 'app-watchlist-button',
  templateUrl: './watchlist-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistButton {
  private readonly watchlistService = inject(WatchlistService);
  private checkRequestToken = 0;

  readonly mediaId = input.required<number>();
  readonly mediaType = input.required<MediaType>();
  readonly mediaTitle = input('this title');
  readonly variant = input<WatchlistButtonVariant>('pill');

  readonly changed = output<WatchlistChangeEvent>();

  readonly isInWatchlist = signal(false);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  readonly ariaLabel = computed(() =>
    this.isInWatchlist()
      ? `Remove ${this.mediaTitle()} from watchlist`
      : `Add ${this.mediaTitle()} to watchlist`
  );

  readonly label = computed(() => {
    if (this.isLoading()) {
      return this.isInWatchlist() ? 'Removing...' : 'Saving...';
    }

    if (this.variant() === 'compact') {
      return this.isInWatchlist() ? 'Saved' : 'Watchlist';
    }

    return this.isInWatchlist() ? 'In Watchlist' : 'Add to Watchlist';
  });

  readonly buttonClass = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background';
    const variant = this.variant();
    const active = this.isInWatchlist();
    const activeColors = 'border border-foreground bg-foreground text-background hover:bg-white/90';
    const inactiveColors = 'border border-border bg-secondary text-foreground hover:bg-muted';

    if (variant === 'icon') {
      return active
        ? `${base} h-10 w-10 ${activeColors}`
        : `${base} h-10 w-10 ${inactiveColors}`;
    }

    if (variant === 'compact') {
      return active
        ? `${base} h-11 rounded-md px-5 text-sm font-semibold ${activeColors}`
        : `${base} h-11 rounded-md px-5 text-sm font-medium ${inactiveColors}`;
    }

    return active
      ? `${base} h-11 px-4 text-sm font-semibold ${activeColors}`
      : `${base} h-11 px-4 text-sm font-semibold ${inactiveColors}`;
  });

  constructor() {
    effect(() => {
      const mediaId = this.mediaId();
      const mediaType = this.mediaType();
      void this.syncStatus(mediaId, mediaType);
    });
  }

  async toggleWatchlist(): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    const mediaId = this.mediaId();
    const mediaType = this.mediaType();
    const currentlySaved = this.isInWatchlist();

    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      if (currentlySaved) {
        await this.watchlistService.deleteItem(mediaId, mediaType);
      } else {
        await this.watchlistService.saveItem(mediaId, mediaType);
      }

      const nextValue = !currentlySaved;
      this.isInWatchlist.set(nextValue);
      this.changed.emit({ mediaId, mediaType, isInWatchlist: nextValue });
    } catch {
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async syncStatus(mediaId: number, mediaType: MediaType): Promise<void> {
    const token = ++this.checkRequestToken;
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const inWatchlist = await this.watchlistService.isItemInUserWatchlist(mediaId, mediaType);

      if (token !== this.checkRequestToken) {
        return;
      }

      this.isInWatchlist.set(inWatchlist);
    } catch {
      if (token !== this.checkRequestToken) {
        return;
      }

      this.hasError.set(true);
      this.isInWatchlist.set(false);
    } finally {
      if (token === this.checkRequestToken) {
        this.isLoading.set(false);
      }
    }
  }
}
