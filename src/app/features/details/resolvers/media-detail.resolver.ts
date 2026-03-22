import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TmdbService } from '../../../core/services/tmdb/tmdb-service';
import { MediaDetail, MediaType } from '../../../shared/models/MediaDetail';

const getMediaTypeFromRoute = (route: ActivatedRouteSnapshot): MediaType => {
  const firstSegment = route.url[0]?.path ?? route.routeConfig?.path?.split('/')[0];
  return firstSegment === 'tv' ? 'tv' : 'movie';
};

export const mediaDetailResolver: ResolveFn<MediaDetail | null> = (route) => {
  const mediaId = Number.parseInt(route.paramMap.get('id') ?? '', 10);

  if (!Number.isFinite(mediaId) || mediaId <= 0) {
    return of(null);
  }

  return inject(TmdbService)
    .getMediaDetail(getMediaTypeFromRoute(route), mediaId)
    .pipe(catchError(() => of(null)));
};
