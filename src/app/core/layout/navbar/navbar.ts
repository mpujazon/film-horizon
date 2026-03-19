import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SearchBar} from '../../../features/search/components/search-bar/search-bar';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    SearchBar
  ],
  templateUrl: './navbar.html'
})
export class Navbar {
  appName = 'FilmHorizon';
  isMobileMenuOpen = signal(false);

  links = [
    {
      id:1,
      label:'Home',
      path:'/'
    },
    {
      id:2,
      label:'Movies',
      path:'/movies'
    },
    {
      id:3,
      label:'TV Shows',
      path:'/tv-shows'
    }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
