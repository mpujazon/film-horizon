import { Component } from '@angular/core';
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
}
