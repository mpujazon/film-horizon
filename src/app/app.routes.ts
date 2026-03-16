import { Routes } from '@angular/router';
import {Homepage} from './features/home/pages/homepage/homepage';
import { SearchResults } from './features/search/pages/search-results/search-results';

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
    path:"**",
    redirectTo:""
  }
];
