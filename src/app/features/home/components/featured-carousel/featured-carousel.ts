import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import {API_CONFIG} from '../../../../core/config/api.config';
import {Media} from '../../../../shared/models/Media';
import { WatchlistButton } from '../../../../shared/components/watchlist-button/watchlist-button';

@Component({
  selector: 'app-featured-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink, WatchlistButton],
  templateUrl: './featured-carousel.html'
})
export class FeaturedCarousel {
  readonly movies = input<readonly Media[]>([]);
  readonly autoplay = input<boolean>(true);
  readonly autoplayIntervalMs = input<number>(7000);
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
        this.advanceStepBy(1);
      }, intervalMs);
    });

    this.destroyRef.onDestroy(() => {
      this.stopAutoplay();
    });
  }

  protected nextStep(): void {
    if (!this.advanceStepBy(1)) {
      return;
    }

    this.restartAutoplay();
  }

  protected previousStep(): void {
    if (!this.advanceStepBy(-1)) {
      return;
    }

    this.restartAutoplay();
  }

  protected goToStep(step: number): void {
    if (step < 0 || step >= this.movies().length) {
      return;
    }

    if (this.normalizedStep() === step) {
      return;
    }

    this.currentStep.set(step);
    this.restartAutoplay();
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

  private stopAutoplay(): void {
    if (this.autoplayTimer === null) {
      return;
    }

    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
  }

  private restartAutoplay(): void {
    if (!this.autoplay() || this.movies().length <= 1) {
      return;
    }

    this.stopAutoplay();

    const intervalMs = Math.max(1000, this.autoplayIntervalMs());
    this.autoplayTimer = setInterval(() => {
      this.advanceStepBy(1);
    }, intervalMs);
  }

  private advanceStepBy(offset: number): boolean {
    const total = this.movies().length;

    if (total <= 1) {
      return false;
    }

    this.currentStep.update((step) => {
      const nextStep = (step + offset) % total;
      return nextStep < 0 ? nextStep + total : nextStep;
    });

    return true;
  }

  protected readonly API_CONFIG = API_CONFIG;
}
