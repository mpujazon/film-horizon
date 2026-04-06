import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { API_CONFIG } from '../../../../core/config/api.config';
import {
  MediaCastMember,
  MediaCrewMember,
  MediaDetail,
  MediaDetailViewModel
} from '../../../../shared/models/MediaDetail';
import { TrailerModal } from '../../../../shared/components/trailer-modal/trailer-modal';
import { WatchlistButton } from '../../../../shared/components/watchlist-button/watchlist-button';

@Component({
  selector: 'app-media-detail',
  imports: [NgOptimizedImage, RouterLink, TrailerModal, WatchlistButton],
  templateUrl: './media-detail.html',
  styleUrl: './media-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  protected readonly imageBaseUrl = API_CONFIG.tmdbImageBaseUrl;

  protected readonly media = toSignal(
    this.route.data.pipe(map((data) => (data['media'] as MediaDetail | null) ?? null)),
    { initialValue: null }
  );

  protected readonly viewModel = computed<MediaDetailViewModel | null>(() => {
    const detail = this.media();

    if (!detail) {
      return null;
    }

    return {
      title: detail.title ?? detail.name ?? 'Unknown title',
      mediaTypeLabel: detail.media_type === 'tv' ? 'TV Series' : 'Movie',
      releaseYear: this.getReleaseDate(detail),
      runtimeLabel: this.getRuntimeLabel(detail),
      genresLabel: this.getGenresLabel(detail),
      ratingLabel: this.getRatingLabel(detail),
      voteCountLabel: this.getVoteCountLabel(detail),
      directorLabel: this.getDirectorLabel(detail),
      overview: detail.overview || 'No synopsis is available for this title yet.',
      topCast: (detail.credits?.cast ?? []).slice(0, 8),
      trailerKey: this.getTrailerKey(detail),
      backdropUrl: this.getImageUrl(detail.backdrop_path, 'w1280'),
      posterUrl: this.getImageUrl(detail.poster_path, 'w780'),
      status: detail.status,
      tagline: detail.tagline ?? null,
      mediaId: detail.id,
      mediaType: detail.media_type
    };
  });

  protected readonly isTrailerModalOpen = signal(false);

  constructor() {
    effect(() => {
      if (this.viewModel()) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  protected getProfileUrl(castMember: MediaCastMember): string {
    return castMember.profile_path ? `${this.imageBaseUrl}/w185${castMember.profile_path}` : '';
  }

  protected openTrailerModal(): void {
    if (!this.viewModel()?.trailerKey) {
      return;
    }

    this.isTrailerModalOpen.set(true);
  }

  protected closeTrailerModal(): void {
    this.isTrailerModalOpen.set(false);
  }

  private findCrewByJob(crew: MediaCrewMember[], job: string): MediaCrewMember | null {
    return crew.find((member) => member.job === job) ?? null;
  }

  private getReleaseDate(detail: MediaDetail): string {
    const releaseDate = detail.release_date ?? detail.first_air_date;
    return releaseDate ?? 'TBA';
  }

  private getRuntimeLabel(detail: MediaDetail): string {
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
  }

  private getGenresLabel(detail: MediaDetail): string {
    return detail.genres.length > 0 ? detail.genres.map((genre) => genre.name).join(' · ') : 'Genre not listed';
  }

  private getRatingLabel(detail: MediaDetail): string {
    return typeof detail.vote_average === 'number' ? detail.vote_average.toFixed(1) : 'N/A';
  }

  private getVoteCountLabel(detail: MediaDetail): string {
    return typeof detail.vote_count === 'number' ? detail.vote_count.toLocaleString() : '0';
  }

  private getDirectorLabel(detail: MediaDetail): string {
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
  }

  private getTrailerKey(detail: MediaDetail): string | null {
    const videos = detail.videos?.results ?? [];
    const trailer =
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) ??
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ??
      null;

    return trailer?.key ?? null;
  }

  private getImageUrl(path: string | null | undefined, size: 'w1280' | 'w780'): string | null {
    return path ? `${this.imageBaseUrl}/${size}${path}` : null;
  }
}
