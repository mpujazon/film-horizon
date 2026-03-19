import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TmdbService } from '../../../core/services/tmdb-service';
import { ActorDetail } from '../../../shared/models/ActorDetail';

export const actorDetailResolver: ResolveFn<ActorDetail | null> = (route) => {
  const actorId = Number.parseInt(route.paramMap.get('id') ?? '', 10);

  if (!Number.isFinite(actorId) || actorId <= 0) {
    return of(null);
  }

  return inject(TmdbService)
    .getActorDetail(actorId)
    .pipe(catchError(() => of(null)));
};
