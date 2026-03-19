import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { API_CONFIG } from '../../../../core/config/api.config';
import { MediaCastMember, MediaCrewMember, MediaDetail } from '../../../../shared/models/MediaDetail';

@Component({
  selector: 'app-media-detail',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './media-detail.html',
  styleUrl: './media-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  protected readonly imageBaseUrl = API_CONFIG.tmdbImageBaseUrl;
  protected readonly isInWatchlist = signal(false);

  protected readonly media = toSignal(
    this.route.data.pipe(map((data) => (data['media'] as MediaDetail | null) ?? null)),
    { initialValue: null }
  );

  protected readonly hasMedia = computed(() => this.media() !== null);
  protected readonly title = computed(() => this.media()?.title ?? this.media()?.name ?? 'Unknown title');
  protected readonly mediaTypeLabel = computed(() =>
    this.media()?.media_type === 'tv' ? 'TV Series' : 'Movie'
  );
  protected readonly releaseYear = computed(() => {
    const releaseDate = this.media()?.release_date ?? this.media()?.first_air_date;

    if (!releaseDate) {
      return 'TBA';
    }

    const year = Number.parseInt(releaseDate.slice(0, 4), 10);
    return Number.isFinite(year) ? String(year) : 'TBA';
  });
  protected readonly runtimeLabel = computed(() => {
    const detail = this.media();

    if (!detail) {
      return 'Runtime unavailable';
    }

    if (detail.media_type === 'tv') {
      const minutes = detail.episode_run_time?.find((value) => value > 0);
      if (!minutes) {
        return detail.number_of_seasons ? `${detail.number_of_seasons} season(s)` : 'TV runtime unavailable';
      }

      return `${minutes} min / episode`;
    }

    if (!detail.runtime || detail.runtime <= 0) {
      return 'Runtime unavailable';
    }

    const hours = Math.floor(detail.runtime / 60);
    const minutes = detail.runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  });
  protected readonly genresLabel = computed(() => {
    const genres = this.media()?.genres ?? [];
    return genres.length > 0 ? genres.map((genre) => genre.name).join(' · ') : 'Genre not listed';
  });
  protected readonly ratingLabel = computed(() => {
    const rating = this.media()?.vote_average;
    return typeof rating === 'number' ? rating.toFixed(1) : 'N/A';
  });
  protected readonly voteCountLabel = computed(() => {
    const voteCount = this.media()?.vote_count;
    return typeof voteCount === 'number' ? voteCount.toLocaleString() : '0';
  });
  protected readonly directorLabel = computed(() => {
    const detail = this.media();

    if (!detail) {
      return 'Not available';
    }

    if (detail.media_type === 'movie') {
      const director = this.findCrewByJob(detail.credits?.crew ?? [], 'Director');
      return director?.name ?? 'Not available';
    }

    const creator = detail.created_by?.[0];
    if (creator) {
      return creator.name;
    }

    const showrunner = this.findCrewByJob(detail.credits?.crew ?? [], 'Executive Producer');
    return showrunner?.name ?? 'Not available';
  });
  protected readonly overview = computed(
    () => this.media()?.overview || 'No synopsis is available for this title yet.'
  );
  protected readonly topCast = computed(() => (this.media()?.credits?.cast ?? []).slice(0, 8));
  protected readonly trailerUrl = computed(() => {
    const videos = this.media()?.videos?.results ?? [];
    const trailer =
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) ??
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ??
      null;

    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  });
  protected readonly backdropUrl = computed(() => {
    const backdropPath = this.media()?.backdrop_path;
    return backdropPath ? `${this.imageBaseUrl}/w1280${backdropPath}` : null;
  });
  protected readonly posterUrl = computed(() => {
    const posterPath = this.media()?.poster_path;
    return posterPath ? `${this.imageBaseUrl}/w780${posterPath}` : null;
  });

  constructor() {
    effect(() => {
      if (this.media()) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  protected getProfileUrl(castMember: MediaCastMember): string {
    return castMember.profile_path ? `${this.imageBaseUrl}/w185${castMember.profile_path}` : '';
  }

  protected toggleWatchlist(): void {
    this.isInWatchlist.update((value) => !value);
  }

  private findCrewByJob(crew: MediaCrewMember[], job: string): MediaCrewMember | null {
    return crew.find((member) => member.job === job) ?? null;
  }
}
