import { Component } from '@angular/core';
import { FeaturedCarousel, type FeaturedMovie } from '../../components/featured-carousel/featured-carousel';

@Component({
  selector: 'app-homepage',
  imports: [
    FeaturedCarousel
  ],
  templateUrl: './homepage.html'
})
export class Homepage {
  protected readonly featuredMovies: readonly FeaturedMovie[] = [
    {
      title: 'Dune: Part Two',
      description:
        'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      imageUrl: 'https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
      movieId: 438631
    },
    {
      title: 'The Batman',
      description:
        'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
      imageUrl: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
      movieId: 414906
    },
    {
      title: 'Oppenheimer',
      description:
        'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
      imageUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      movieId: 872585
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      description:
        'Miles Morales catapults across the Multiverse where he meets a team of Spider-People charged with protecting reality.',
      imageUrl: 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg',
      movieId: 569094
    },
    {
      title: 'Top Gun: Maverick',
      description:
        'After more than thirty years of service, Maverick trains a detachment of Top Gun graduates for a specialized mission.',
      imageUrl: 'https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg',
      movieId: 361743
    }
  ];
}
