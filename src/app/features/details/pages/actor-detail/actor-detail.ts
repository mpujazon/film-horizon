import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { API_CONFIG } from '../../../../core/config/api.config';
import { ActorCredit, ActorDetail } from '../../../../shared/models/ActorDetail';

@Component({
  selector: 'app-actor-detail',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './actor-detail.html',
  styleUrl: './actor-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActorDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
  protected readonly imageBaseUrl = API_CONFIG.tmdbImageBaseUrl;

  protected readonly actor = toSignal(
    this.route.data.pipe(map((data) => (data['actor'] as ActorDetail | null) ?? null)),
    { initialValue: null }
  );

  protected readonly hasActor = computed(() => this.actor() !== null);
  protected readonly actorName = computed(() => this.actor()?.name ?? 'Unknown actor');
  protected readonly profileUrl = computed(() => {
    const profilePath = this.actor()?.profile_path;
    return profilePath ? `${this.imageBaseUrl}/w780${profilePath}` : null;
  });
  protected readonly knownForDepartment = computed(() => this.actor()?.known_for_department ?? 'Performer');
  protected readonly birthDateLabel = computed(() => this.formatDate(this.actor()?.birthday));
  protected readonly ageLabel = computed(() => this.getAgeLabel(this.actor()?.birthday, this.actor()?.deathday));
  protected readonly placeOfBirthLabel = computed(() => this.actor()?.place_of_birth ?? 'Not available');
  protected readonly biography = computed(
    () => this.actor()?.biography?.trim() || 'No biography is available for this actor yet.'
  );
  protected readonly popularityLabel = computed(() => {
    const popularity = this.actor()?.popularity;
    return typeof popularity === 'number' ? popularity.toFixed(1) : 'N/A';
  });
  protected readonly filmographyCount = computed(() => (this.actor()?.combined_credits?.cast ?? []).length);
  protected readonly topCredits = computed(() =>
    [...(this.actor()?.combined_credits?.cast ?? [])]
      .filter((credit) => credit.media_type === 'movie' || credit.media_type === 'tv')
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
      .slice(0, 8)
  );

  constructor() {
    effect(() => {
      if (this.actor()) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  protected getCreditPosterUrl(credit: ActorCredit): string {
    return credit.poster_path ? `${this.imageBaseUrl}/w342${credit.poster_path}` : '';
  }

  protected getCreditTitle(credit: ActorCredit): string {
    return credit.title ?? credit.name ?? 'Untitled project';
  }

  protected getCreditRoute(credit: ActorCredit): string[] {
    const routePrefix = credit.media_type === 'tv' ? '/tv' : '/movie';
    return [routePrefix, String(credit.id)];
  }

  protected getCreditYear(credit: ActorCredit): string {
    const date = credit.release_date ?? credit.first_air_date;

    if (!date) {
      return 'TBA';
    }

    return date.slice(0, 4);
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) {
      return 'Unknown';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Unknown';
    }

    return this.dateFormatter.format(parsed);
  }

  private getAgeLabel(birthday: string | null | undefined, deathday: string | null | undefined): string {
    if (!birthday) {
      return 'Age unavailable';
    }

    const birthDate = new Date(birthday);
    if (Number.isNaN(birthDate.getTime())) {
      return 'Age unavailable';
    }

    const endDate = deathday ? new Date(deathday) : new Date();
    if (Number.isNaN(endDate.getTime())) {
      return 'Age unavailable';
    }

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      endDate.getMonth() > birthDate.getMonth() ||
      (endDate.getMonth() === birthDate.getMonth() && endDate.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age -= 1;
    }

    if (age < 0) {
      return 'Age unavailable';
    }

    return deathday ? `${age} (at passing)` : String(age);
  }
}
