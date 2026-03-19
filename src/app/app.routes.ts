import { Routes } from '@angular/router';
import {Homepage} from './features/home/pages/homepage/homepage';
import { SearchResults } from './features/search/pages/search-results/search-results';
import { MediaDetailPage } from './features/details/pages/media-detail/media-detail';
import { mediaDetailResolver } from './features/details/resolvers/media-detail.resolver';
import { ActorDetailPage } from './features/details/pages/actor-detail/actor-detail';
import { actorDetailResolver } from './features/details/resolvers/actor-detail.resolver';

export const routes: Routes = [
  {
    path:"",
    component: Homepage
  },
  {
    path: 'search',
    component: SearchResults
  },
  {
    path: 'movie/:id',
    component: MediaDetailPage,
    resolve: {
      media: mediaDetailResolver
    }
  },
  {
    path: 'tv/:id',
    component: MediaDetailPage,
    resolve: {
      media: mediaDetailResolver
    }
  },
  {
    path: 'actor/:id',
    component: ActorDetailPage,
    resolve: {
      actor: actorDetailResolver
    }
  },
  {
    path:"**",
    redirectTo:""
  }
];
