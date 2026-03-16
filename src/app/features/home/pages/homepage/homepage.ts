import { Component } from '@angular/core';
import { FeaturedCarousel } from '../../components/featured-carousel/featured-carousel';
import {FeaturedContent} from '../../../../shared/models/FeaturedMovie';

@Component({
  selector: 'app-homepage',
  imports: [
    FeaturedCarousel
  ],
  templateUrl: './homepage.html'
})
export class Homepage {
  protected readonly featuredMovies: readonly FeaturedContent[] = [
    {
      title: 'Dune: Part Two',
      description:
        'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      imageUrl: 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
      id: 438631,
      type: 'movie'
    },
    {
      title: 'The Batman',
      description:
        'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
      imageUrl: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
      id: 414906,
      type: 'movie'

    },
    {
      title: 'Oppenheimer',
      description:
        'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
      imageUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      id: 872585,
      type: 'movie'

    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      description:
        'Miles Morales catapults across the Multiverse where he meets a team of Spider-People charged with protecting reality.',
      imageUrl: 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg',
      id: 569094,
      type: 'movie'

    },
    {
      title: 'Top Gun: Maverick',
      description:
        'After more than thirty years of service, Maverick trains a detachment of Top Gun graduates for a specialized mission.',
      imageUrl: 'https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg',
      id: 361743,
      type: 'movie'

    }
  ];
}
