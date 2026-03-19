# Project Analysis Starter - FilmHorizon

## 1) Context and Goal

**Project name:** FilmHorizon

**One-line value proposition:**
Create a private web app where users can discover movies and manage their personal favorites and ratings.

**Problem statement:**
Users do not have a simple, visual, and persistent way to track cinematic preferences, ratings, and favorite titles.

**Target users:**
- Media enthusiasts and regular users who want a personal movie tracking space.
- Main usage on mobile and desktop.

**Business goals (KPIs):**
- User activation: % users who complete signup and first favorite.
- Engagement: average favorites/ratings per active user.
- Retention: users returning weekly.
- Task success: time to find and save a movie.

---

## 2) Constraints and Stakeholders

**Constraints identified from briefing/kickoff:**
- Must be a SPA.
- Framework: Angular 21 (decision made).
- Styling: Tailwind CSS (chosen to accelerate delivery).
- TMDB API as external movie source.
- Auth with Firebase or equivalent.
- Own database for user-specific data (likes, ratings, favorites).
- Mobile-first design.
- Accessible UI (WCAG-oriented).
- Unit testing required (with Gherkin scenarios expected in project context).
- Deployment target: Netlify, Vercel, or GitHub Pages.

**Stakeholders:**
- Product owner/client (defines priorities and MVP scope).
- Frontend developer team.
- Backend/data owner.
- QA/testing.

---

## 3) Scope Definition (v1)

### In Scope
- Media exploration list with search/filter.
- Media detail view.
- Actor detail view.
- Director detail view.
- User signup/login.
- Favorites management.
- Personal rating (1 to 10).
- Personal favorites list and edit/remove actions.

### Out of Scope (for v1)
- Social sharing.
- User comments/reviews.
- Advanced recommendation engine.
- Extended analytics dashboard (unless needed for epic 5 delivery).

### Assumptions
- TMDB endpoints needed for movies, people, and credits are available and stable.
- Firebase (or equivalent) can satisfy auth requirements within project timeline.
- Only authenticated users can persist personal preferences.

### Risks
| Risk | Impact | Probability | Mitigation | Owner |
|---|---|---|---|---|
| TMDB rate limits / API gaps | High | Medium | Add caching, retries, and fallback states | Dev |
| Scope expansion beyond MVP | High | High | Freeze v1 scope and backlog optional features | PO + Dev |
| Auth integration complexity | Medium | Medium | Implement early spike/prototype | Dev |
| Accessibility debt | Medium | Medium | Add a11y checks during UI implementation, not at end | Dev + QA |

---

## 4) MVP Epics and Use Cases

### Epic Prioritization
1. Exploration and search.
2. Detailed views (movie/actor/director).
3. Authentication.
4. Favorites and personal ranking.
5. Ranking statistics (if included in target level).

### High-Value Use Cases

#### UC-01 Explore Movies
**Actor:** Guest/User  
**Goal:** Discover movies by browsing and filtering.  
**Main flow:** Open app -> browse list -> search/filter -> open detail.

#### UC-02 Register/Login
**Actor:** Guest  
**Goal:** Access personal movie features.  
**Main flow:** Open auth form -> submit credentials -> authenticated session.

#### UC-03 Save Favorite and Rate Media
**Actor:** Authenticated user  
**Goal:** Persist personal preference for a movie.  
**Main flow:** Open movie detail -> mark favorite -> set rating -> save.

#### UC-04 Manage Favorites List
**Actor:** Authenticated user  
**Goal:** Maintain personal collection.  
**Main flow:** Open favorites -> update rating/remove favorite.

---

## 5) Functional Requirements (FR)

- FR-001: The system shall allow users to browse a list of movies from TMDB.
- FR-002: The system shall support search and filtering in exploration views.
- FR-003: The system shall display detailed movie information (synopsis, cast, director, release date, trailer if available).
- FR-004: The system shall display actor detail pages.
- FR-005: The system shall display director detail pages.
- FR-006: The system shall allow user registration and login.
- FR-007: The system shall allow authenticated users to mark/unmark movies as favorites.
- FR-008: The system shall allow authenticated users to assign a personal rating (1-10).
- FR-009: The system shall persist favorites/ratings in a project-owned database.
- FR-010: The system shall expose unique routes for movie, actor, and director detail pages.

---

## 6) Non-Functional Requirements (NFR)

- NFR-001 (Performance): Main exploration view should become interactive within acceptable SPA budget on mid-range mobile.
- NFR-002 (Accessibility): Core flows should meet WCAG 2.2 AA-oriented checks.
- NFR-003 (Security): Authenticated data must be private per user.
- NFR-004 (Usability): Mobile-first layout and clear feedback after user actions.
- NFR-005 (Maintainability): Feature-based architecture and testable modules.

---

## 7) Architecture Decisions

**Frontend framework:** Angular 21  
**Styling approach:** Tailwind CSS (delivery-speed oriented)  
**Recommended state strategy:**
- Local UI state for components.
- Shared app state for auth/session and favorites context.

**Data sources:**
- External: TMDB API.
- Internal: user preferences storage (favorites/ratings).

**Proposed route map:**
- `/` (home)
- `/explore`
- `/movie/:id`
- `/actor/:id`
- `/director/:id`
- `/favorites` (auth)
- `/login`, `/register`
- `/profile` (auth)
- `*` (404)

---

## 8) Acceptance Criteria Samples (Given/When/Then)

**AC-01 Search**
- Given the user is on `/explore`
- When the user searches by title keyword
- Then the list updates with matching movies

**AC-02 Favorite**
- Given an authenticated user on `/movie/:id`
- When the user marks the movie as favorite
- Then the movie appears in `/favorites`

**AC-03 Access control**
- Given a non-authenticated user
- When trying to open `/favorites`
- Then the user is redirected to `/login`

---

## 9) Testing Strategy (Starter)

- Unit tests for core logic (filters, mappers, auth helpers).
- Component tests for exploration list, detail view, and favorite actions.
- E2E tests for top flows:
  - Search -> detail
  - Register/login
  - Add/remove favorite and rate
- Gherkin scenarios for MVP acceptance paths.

---

## 10) Delivery Plan (Starter)

**Sprint 1**
- Project setup, routing, base layout, TMDB integration spike.

**Sprint 2**
- Exploration list + filtering + movie detail.

**Sprint 3**
- Actor/director details + authentication.

**Sprint 4**
- Favorites, personal ratings, and persistence.

**Sprint 5**
- Tests, accessibility pass, performance pass, deployment.

---

## 11) Open Questions to Resolve Early

- Exact scope of Epic 5 (ranking statistics) for MVP handoff.
- Preferred auth provider (Firebase vs equivalent).
- Deployment target platform (Netlify, Vercel, GitHub Pages).
- Whether a watchlist is required in v1 or treated as optional.

---

## 12) Definition of Done (DoD)

- Feature meets acceptance criteria.
- Tests implemented and passing.
- Accessibility checks completed in key flows.
- Error states and loading states implemented.
- Code reviewed and documented.
- Deployed and smoke-tested.
