# FilmHorizon

FilmHorizon is a private movie-tracking SPA where users can discover movies and manage personal favorites and ratings.

## Context

Users need a simple, visual, and persistent way to save movie preferences. This project focuses on fast task completion:

- Search and explore movies.
- Open detailed movie, actor, and director views.
- Sign in and persist favorites and ratings (1-10).

## MVP Scope

### In scope (v1)

- Movie exploration with search and filters.
- Movie detail page (synopsis, cast, director, release date, trailer if available).
- Actor and director detail pages.
- User authentication (register/login).
- Favorites management and personal ratings.
- Protected user areas (`/favorites`, `/profile`).

### Out of scope (v1)

- Social sharing.
- Public comments/reviews.
- Advanced recommendation engine.

## Tech Stack

- Angular 21 (standalone-first architecture).
- Tailwind CSS (mobile-first, accessible UI, chosen to accelerate delivery).
- TMDB API for movie/person/credits data.
- Firebase for authentication and user-specific persistence.
- Vercel for deployment.

## Route Map (v1)

- Public: `/`, `/explore`, `/movie/:id`, `/actor/:id`, `/director/:id`, `/login`, `/register`
- Auth-only: `/favorites`, `/profile`
- Fallback: `*` -> 404

## Non-Functional Targets

- Performance: fast interactive experience on mid-range mobile.
- Accessibility: WCAG 2.2 AA-oriented checks on core flows.
- Security: favorites/ratings are private per authenticated user.
- Maintainability: feature-based architecture and testable modules.

## Quick Start

### Prerequisites

- Node.js LTS
- Angular CLI 21+

### Install and run

```bash
npm install
ng serve
```

Open `http://localhost:4200/`.

## Scripts

```bash
ng serve      # start development server
ng build      # production build
ng test       # run unit tests
ng e2e        # run end-to-end tests (when configured)
```

## Quality and Testing Strategy

- Unit tests for core logic (filters, mappers, auth helpers).
- Component tests for explore, detail, and favorite/rating flows.
- E2E happy paths:
  - Search -> detail
  - Register/login
  - Add/remove favorite and rate
- Gherkin scenarios aligned with acceptance criteria.

## Risks and Mitigation

- TMDB limits/data gaps: caching, retries, and robust empty/error states.
- Scope creep: freeze v1 scope and push extras to backlog.
- Auth complexity: validate integration early.
- Accessibility debt: include a11y checks during implementation, not at the end.

## Delivery Plan

- Sprint 1: project setup, routing, base layout, TMDB spike.
- Sprint 2: exploration + filtering + movie detail.
- Sprint 3: actor/director details + auth.
- Sprint 4: favorites + ratings + persistence.
- Sprint 5: testing, accessibility/performance pass, deployment.

## Definition of Done

A feature is complete only when:

- Acceptance criteria pass.
- Relevant tests are implemented and passing.
- Loading, error, and empty states are present.
- Accessibility checks are completed for affected flows.
- Code is reviewed and documented.
- Feature is deployed and smoke-tested.
