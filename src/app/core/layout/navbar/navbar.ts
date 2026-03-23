import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {SearchBar} from '../../../features/search/components/search-bar/search-bar';
import {AuthService} from '../../services/auth/auth-service';

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
  readonly authService = inject(AuthService);
  private router = inject(Router);
  isMobileMenuOpen = signal(false);

  links = [
    {
      id:1,
      label:'Home',
      path:'/'
    }
  ];

  onLogOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
