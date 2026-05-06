# Design: Sitemap Architecture

## Strategy
We will use `super-sitemap` which integrates directly with SvelteKit's routing system.

## Components
1. **Server Route**: `src/routes/sitemap.xml/+server.ts`. This endpoint will call `sitemap.generate()` from `super-sitemap`.
2. **Configuration**:
    - `origin`: The production URL of the site.
    - `paramValues`: Define `lang: ['en', 'es']` to ensure localized routes are crawled correctly.
3. **Robots.txt**: `src/routes/robots.txt/+server.ts` (or a static file in `public/`). Given we want to point to the sitemap dynamically if needed, a server route or static file is fine. We'll use a static file in `public/robots.txt` for simplicity unless dynamic logic is needed.

## Tradeoffs
- **Dynamic vs Static**: Using a server route for the sitemap ensures it's always up to date as routes are added/removed.
- **Dependency**: Adding `super-sitemap` as a dev dependency (it's used at build/runtime in SvelteKit).
