import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import {API_CONFIG} from '../../../../core/config/api.config';
import {Media} from '../../../../shared/models/Media';

@Component({
  selector: 'app-featured-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './featured-carousel.html'
})
export class FeaturedCarousel {
  readonly movies = input<readonly Media[]>([]);
  readonly autoplay = input<boolean>(true);
  readonly autoplayIntervalMs = input<number>(7000);

  readonly watchlistClicked = output<void>();
  protected readonly currentStep = signal(0);

  protected readonly hasMovies = computed(() => this.movies().length > 0);
  protected readonly normalizedStep = computed(() => {
    const total = this.movies().length;

    if (total === 0) {
      return 0;
    }

    return this.currentStep() % total;
  });

  protected readonly currentMovie = computed(() => {
    const movieList = this.movies();

    if (movieList.length === 0) {
      return null;
    }

    return movieList[this.normalizedStep()];
  });

  protected readonly movieDetailLink = computed(() => {
    const movie = this.currentMovie();
    if (movie === null) {
      return '/movie';
    }

    const mediaTypePath = movie.media_type === 'tv' ? 'tv' : 'movie';
    return `/${mediaTypePath}/${movie.id}`;
  });

  protected readonly controls = computed(() =>
    this.movies().map((movie, index) => ({
      index,
      title: movie.title
    }))
  );

  private readonly destroyRef = inject(DestroyRef);
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      this.stopAutoplay();

      if (!this.autoplay() || this.movies().length <= 1) {
        return;
      }

      const intervalMs = Math.max(1000, this.autoplayIntervalMs());
      this.autoplayTimer = setInterval(() => {
        this.nextStep();
      }, intervalMs);
    });

    this.destroyRef.onDestroy(() => {
      this.stopAutoplay();
    });
  }

  protected nextStep(): void {
    const total = this.movies().length;

    if (total <= 1) {
      return;
    }

    this.currentStep.update((step) => (step + 1) % total);
  }

  protected previousStep(): void {
    const total = this.movies().length;

    if (total <= 1) {
      return;
    }

    this.currentStep.update((step) =>
      step === 0 ? total - 1 : step - 1
    );
  }

  protected goToStep(step: number): void {
    if (step < 0 || step >= this.movies().length) {
      return;
    }

    this.currentStep.set(step);
  }

  protected isActiveStep(step: number): boolean {
    return this.normalizedStep() === step;
  }

  protected onCarouselKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousStep();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextStep();
    }
  }

  protected onAddToWatchlist(): void {
    this.watchlistClicked.emit();
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer === null) {
      return;
    }

    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }

  protected readonly API_CONFIG = API_CONFIG;
}
