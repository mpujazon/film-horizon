import { Component } from '@angular/core';
import {FeaturedCarousel} from '../../components/featured-carousel/featured-carousel';

@Component({
  selector: 'app-homepage',
  imports: [
    FeaturedCarousel
  ],
  templateUrl: './homepage.html'
})
export class Homepage {

}
