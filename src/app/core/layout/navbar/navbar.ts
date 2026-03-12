import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
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
