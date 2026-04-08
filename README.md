# FilmHorizon

FilmHorizon is an Angular 21 SPA to discover movies and TV shows from TMDB, authenticate users with Firebase, and store each user's personal watchlist.

## Implemented Features

- Authentication with email/password: register, login, logout.
- Email verification flow (`/verify-email`) before entering protected app routes.
- Home page with featured trending content and explore feed.
- Search with:
  - live autocomplete suggestions
  - full results page
  - filters (genre, score, year, trending only)
- Detail pages for:
  - movies and TV (`/movie/:id`, `/tv/:id`)
  - actors (`/actor/:id`)
- Watchlist management (add/remove) persisted per authenticated user in Firestore.

## Tech Stack

- Angular 21 (standalone architecture, signals).
- Tailwind CSS.
- TMDB API.
- Firebase Auth + Firestore.

## Routing

Public:

- `/login`
- `/register`
- `/verify-email`

Protected (authenticated + verified email):

- `/`
- `/search`
- `/movie/:id`
- `/tv/:id`
- `/actor/:id`
- `/watchlist`

Fallback:

- `**` redirects to `/`

## Setup (Angular CLI Preferred)

### Prerequisites

- Node.js LTS
- Angular CLI 21+

Install Angular CLI globally if needed:

```bash
pnpm install -g @angular/cli
```

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
ng serve
```

Open `http://localhost:4200/`.

## CLI Commands

```bash
ng serve                         # start dev server
ng build                         # production build (runs env generation first)
ng test                          # unit tests
ng test --coverage --watch=false # unit tests with coverage
```
