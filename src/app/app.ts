import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './core/layout/navbar/navbar';
import {Footer} from './core/layout/footer/footer';
import {AuthService} from './core/services/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('film-horizon');
  readonly authService = inject(AuthService);
}
