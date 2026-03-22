import { Routes } from '@angular/router';
import {Homepage} from './features/home/pages/homepage/homepage';
import { SearchResults } from './features/search/pages/search-results/search-results';
import { MediaDetailPage } from './features/details/pages/media-detail/media-detail';
import { mediaDetailResolver } from './features/details/resolvers/media-detail.resolver';
import { ActorDetailPage } from './features/details/pages/actor-detail/actor-detail';
import { actorDetailResolver } from './features/details/resolvers/actor-detail.resolver';
import {Login} from './features/auth/pages/login/login';
import {authGuard} from './core/guards/auth-guard';
import {Register} from './features/auth/pages/register/register/register';
import {EmailVerification} from './features/auth/pages/email-verification/email-verification';
import {AuthLayout} from './core/layout/auth-layout/auth-layout';
import {MainLayout} from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthLayout,
    children: [{ path: '', component: Login }]
  },
  {
    path: 'register',
    component: AuthLayout,
    children: [{ path: '', component: Register }]
  },
  {
    path: 'verify-email',
    component: AuthLayout,
    children: [{ path: '', component: EmailVerification }]
  },
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
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
        path: '**',
        redirectTo: ''
      }
    ]
  }
];
