import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { MovieCard } from '../../../../shared/components/movie-card/movie-card';
import { TmdbService } from '../../../../core/services/tmdb/tmdb-service';
import { Media } from '../../../../shared/models/Media';

@Component({
  selector: 'app-explore',
  imports: [MovieCard],
  templateUrl: './explore.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class Explore implements OnInit {
  private readonly tmdbService = inject(TmdbService);
  private readonly preloadOffsetPx = 600;

  readonly items = signal<Media[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(1);
  readonly loading = signal(false);
  readonly hasMorePages = computed(() => this.currentPage() < this.totalPages());

  ngOnInit() {
    this.loadNextPage();
  }

  onWindowScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - this.preloadOffsetPx;

    if (scrollPosition < threshold) {
      return;
    }

    this.loadNextPage();
  }

  private loadNextPage(): void {
    if (this.loading() || !this.hasMorePages()) {
      return;
    }

    const nextPage = this.currentPage() + 1;

    this.loadPage(nextPage);
  }

  private loadPage(page: number): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.tmdbService.getTrendingMedia(page).subscribe({
      next: (response) => {
        this.items.update((current) => [...current, ...response.results]);
        this.currentPage.set(response.page);
        this.totalPages.set(response.total_pages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
