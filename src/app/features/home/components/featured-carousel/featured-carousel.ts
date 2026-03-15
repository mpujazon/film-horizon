import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './featured-carousel.html'
})
export class FeaturedCarousel {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly imageUrl = input.required<string>();
  readonly movieId = input<number>(1);

  readonly watchlistClicked = output<void>();

  protected readonly movieDetailLink = computed(() => `/movie/${this.movieId()}`);

  protected onAddToWatchlist(): void {
    this.watchlistClicked.emit();
  }
}
