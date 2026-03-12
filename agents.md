# Agents Guide - Movies (Angular 21)

This document defines how human and AI contributors should collaborate on the Movies project.
It is aligned with the analysis in `docs/Project Analysis Starter - Movies.md`.

## 1) Product North Star

- Build a private SPA where users discover movies and manage favorites/ratings.
- Prioritize fast task completion: search -> detail -> favorite/rate.
- Protect user-specific data (favorites, ratings) with authenticated access.
- Keep v1 focused: exploration, details, auth, favorites, ratings.

## 2) Technical Boundaries

- Framework: Angular 21 (standalone-first architecture).
- Styling: Tailwind CSS (chosen to accelerate delivery).
- External API: TMDB (movies, people, credits).
- Auth + persistence: Firebase (Auth + project database).
- Deployment: Vercel.
- UX baseline: mobile-first, responsive on desktop.
- Quality baseline: WCAG-oriented accessibility, unit tests, and Gherkin-oriented acceptance scenarios.

## 3) Agent Roles and Responsibilities

### Product Agent

- Keeps scope aligned to MVP epics and prevents feature creep.
- Verifies each story maps to business goals (activation, engagement, retention, task success).
- Maintains acceptance criteria in Given/When/Then format.

### Angular Architecture Agent

- Owns route map and feature boundaries.
- Enforces modern Angular 21 patterns:
  - Standalone components/directives/pipes.
  - Signal-based local state where possible.
  - `input()` / `output()` APIs over legacy patterns when applicable.
  - Built-in control flow (`@if`, `@for`, `@switch`) over legacy structural syntax.
  - Typed Reactive Forms for auth and editable flows.
  - Functional guards/interceptors with `inject()`.
  - Lazy loading via route-level `loadComponent` / `loadChildren`.
- Ensures protected routes (`/favorites`, `/profile`) enforce authentication.

### Data and Integration Agent

- Implements TMDB client services with error/loading/empty states.
- Handles retries and basic caching strategy to reduce rate-limit risk.
- Defines mapping layer from TMDB payloads to app view models.
- Manages Firebase reads/writes for favorites and ratings with per-user isolation.

### UI and CSS Agent

- Builds accessible, mobile-first interfaces using Tailwind CSS.
- Uses semantic HTML, visible focus states, and keyboard-friendly controls.
- Applies design tokens through `tailwind.config` and CSS variables when needed.
- Keeps component styles encapsulated and avoids global style leakage.
- Ensures clear feedback for loading, success, and error states.

### QA and Test Agent

- Maintains unit tests for core logic (filters, mappers, auth helpers).
- Adds component tests for exploration, detail pages, and favorite/rating actions.
- Defines E2E happy paths:
  - Search -> detail.
  - Register/login.
  - Add/remove favorite and rate.
- Keeps Gherkin scenarios in sync with acceptance criteria.

### Delivery Agent

- Tracks sprint outcomes against plan:
  - Sprint 1: setup, routing, TMDB spike.
  - Sprint 2: exploration + filtering + movie detail.
  - Sprint 3: actor/director detail + auth.
  - Sprint 4: favorites + ratings + persistence.
  - Sprint 5: tests + a11y/perf pass + deploy.
- Validates Definition of Done before merging.

## 4) Project Standards (Mandatory)

### Angular code standards

- Prefer feature-based folders under `src/app/features/*`.
- Keep components presentational when possible; move data access to services/facades.
- Use strict typing for API models and internal DTO/view models.
- Favor pure utilities and deterministic transforms for testability.
- Keep side effects centralized (data services, effects-like orchestration services).

### Tailwind CSS standards

- Mobile-first breakpoints.
- Use utility-first classes and reusable component patterns for consistency.
- Keep custom CSS minimal and avoid `!important` unless unavoidable.
- Use modern layout primitives (`flex`, `grid`, `clamp`, `minmax`) through Tailwind utilities.
- Respect reduced motion preferences for non-essential animations.

### Accessibility standards

- Meet WCAG 2.2 AA-oriented checks on key flows.
- Provide labels, roles, and accessible names for interactive controls.
- Ensure color contrast and non-color affordances.
- Verify keyboard navigation for auth, explore, detail, and favorites flows.

### Performance standards

- Keep initial bundle lean and lazy-load feature routes.
- Avoid unnecessary change detection churn and expensive template work.
- Cache stable TMDB responses where practical.
- Use optimized image loading patterns for posters/backdrops.

## 5) Route and Feature Contract (v1)

- Public routes: `/`, `/explore`, `/movie/:id`, `/actor/:id`, `/director/:id`, `/login`, `/register`.
- Auth-only routes: `/favorites`, `/profile`.
- Fallback: `*` -> 404 page.

Core feature contract:

- Explore must support title search/filter.
- Movie detail must show key metadata, cast, director, and trailer if available.
- Authenticated users can add/remove favorites and set rating (1-10).
- Favorites view allows edit/remove actions with persistent updates.

## 6) Definition of Done (Release Gate)

A task is complete only when all conditions are true:

- Acceptance criteria pass.
- Relevant tests are implemented and passing.
- Loading, error, and empty states are present.
- Accessibility checks completed for the affected flow.
- Code is reviewed and documented.
- Feature is deployed and smoke-tested.

## 7) Working Agreement for Contributors

- Do not expand scope without Product Agent approval.
- Deliver vertical slices (UI + data + tests) per feature.
- Prefer small, reviewable PRs.
- Include a short risk note when touching auth, routing, or API limits.
- Keep this file updated when architecture or standards evolve.
