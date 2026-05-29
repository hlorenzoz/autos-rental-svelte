# Overview

This `AGENTS.md` document serves as the master specification and operating manual for any AI agent or automated developer acting upon this repository. It dictates the architectural standards, development workflows, testing strategies, and technology stack required to build, maintain, and scale this production-ready web application. 

The primary goal is to ensure consistency, high performance, modularity, and strict adherence to Test-Driven Development (TDD) across all agent-generated or assisted code following the SvelteKit official guidelines and best practices.

Use global skills as required, not limited to those specified in this document.


# Project Context

The goal is to implement a SvelteKit professional and premium website.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

## Chrome DevTools MCP

The `chrome-devtools-mcp` server (https://github.com/ChromeDevTools/chrome-devtools-mcp) lets the agent control and inspect a **live Chrome instance** — real browser, real rendering — for reliable automation, in-depth debugging, and performance analysis. Use it to *verify behavior in a real browser*, never as a substitute for Playwright E2E tests in the TDD cycle.

### When to use

Invoke it to **observe and diagnose what actually happens in the browser**, especially:

*   **Runtime debugging:** reproduce a blank page, console error, or hydration mismatch; read source-mapped stack traces and console output.
*   **Performance analysis:** record performance traces and inspect **Core Web Vitals** (LCP, INP, CLS) before tuning — complements Lighthouse CI, which gates PRs.
*   **Network inspection:** verify request priority, caching headers, payloads, and failed/slow requests.
*   **Visual & layout verification:** capture screenshots to confirm Glassmorphism effects, responsive breakpoints, and theming (light/dark) render correctly across viewports.
*   **Interaction automation:** drive clicks, typing, and form fills to reproduce a user-reported bug live.
*   **Memory:** capture heap snapshots when investigating leaks.

### When NOT to use

*   As a replacement for the failing-test-first TDD workflow (Vitest/Playwright remain the source of truth).
*   For backend, pipeline, or non-browser tasks.
*   Do not commit code "verified" only via this MCP without the corresponding automated test.

### Tool categories

Input automation · Navigation · Emulation (device/viewport) · Performance (tracing) · Network · Debugging (screenshots, console, script evaluation, Lighthouse) · Memory (heap snapshots) · Extensions.

### Configuration

MCP client config (`command` + `args`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

---

# Tech Stack

The following stack is strictly enforced. No substitutions or alternative libraries may be introduced without explicit architectural approval.

*   **Runtime & Package Manager:** Bun
*   **Frontend Framework:** SvelteKit 
*   **Styling:** Tailwind CSS v4
*   **Schema & Data Validation:** Zod v4
*   **State Management:** Zustand v5
*   **Unit & Integration Testing:** Vitest (with Coverage integration)
*   **End-to-End (E2E) Testing:** Playwright
*   **Automation:** Just (Task Runner)
*   **Continuous Integration / Quality:** Pre-commit Hooks (Husky/Lefthook), Lighthouse CI
*   **Monitoring & Error Tracking:** Sentry (with Spotlight integration)
    *   **Filtering Policy:** Errors originating from `node_modules` or core node modules are strictly excluded via `beforeSend` to minimize noise in Spotlight and Sentry.
*   **Design Aesthetic:** Glassmorphism (Atmospheric Precision)

---

# Architecture Principles

1.  **Modular & Scalable Design:** Features must be encapsulated within their own domains. Avoid monolithic components or tightly coupled logic.
2.  **Separation of Concerns:** Strictly separate UI components, business logic/state, data fetching, and schema validation.
3.  **Strict Typing:** TypeScript is mandatory. `any` is forbidden. External data interfaces and internal state must be strictly typed and validated at runtime.
4.  **SEO & Accessibility (a11y):** All UI components must adhere to WCAG 2.1 AA standards. Semantic HTML must be used. Metadata, OpenGraph tags, and canonical URLs must be handled dynamically per page.

---

# Design System Rules

If a specific design specification is provided in a feature request, it must be followed pixel-perfectly. If no design is provided, the agent must implement a default UI system with the following characteristics:

*   **Aesthetic:** Clean, modern, professional, and slightly futuristic (Atmospheric Precision).
*   **Glassmorphism:** Use frosted glass effects (`backdrop-blur-md`, `bg-white/10` or `bg-black/10`) for overlays, cards, and navigation elements, complemented by fine, semi-transparent borders.
*   **Spacing & Grid:** Base-8 spacing system utilizing Tailwind's utility classes.
*   **Typography:** highly legible sans-serif stack (e.g., Inter or Roboto default).
*   **Corners & Borders:** Subtle rounded corners (e.g., `rounded-lg` or `rounded-xl`) with fine borders (`border-white/10` in dark mode, `border-gray-200` in light mode).
*   **Interactions:** Smooth transitions on hover, focus, and active states (`transition-all duration-200 ease-in-out`).
*   **Master Design Patterns:** The definitive source for all design tokens, color palettes, typography rules, and component-specific patterns is the `DESIGN.md` file. Agents MUST reference and adhere to this file for any UI-related implementation.

---

# Development Workflow (TDD)

Test-Driven Development is **mandatory**. Agents must execute the following workflow for any feature or bug fix:

1.  **Test Definition:** Write a failing Vitest unit test or Playwright E2E test defining the expected behavior.
2.  **Execution & Verification:** Run the test to ensure it fails as expected (Red).
3.  **Implementation:** Write the minimum amount of robust code required to pass the test.
4.  **Validation:** Run the test to ensure it passes (Green).
5.  **Refactoring:** Clean up code, optimize, and enforce typing/linting without breaking the tests.
6.  **Changelog:** Record the change in `CHANGELOG.md` under `## [Unreleased]` (see Changelog Policy below).
7.  **Pre-commit Validation:** Ensure all pre-commit hooks (linting, type checking, test coverage) pass locally before finalizing the change.

---

# State Management Strategy

*   **Library:** Zustand v5
*   **Scope:** Only use global state for data that genuinely needs to be accessed across disparate parts of the application (e.g., user session, UI theme, complex multi-step forms).
*   **Colocation:** Keep state as close to the UI as possible. Prefer component-level state (React `useState`/`useReducer`) for localized interactivity.
*   **Immutability:** Zustand slices must adhere to immutable update patterns.

---

# Validation Strategy

*   **Library:** Zod v4
*   **API Payloads:** All incoming API data must be parsed and validated through a Zod schema before being utilized in the application state.
*   **Forms:** Form inputs must be validated using Zod schemas on both the client side (before submission) and server side (API endpoints/SvelteKit Actions).
*   **Environment Variables:** Env vars must be strictly typed and validated at application boot using Zod.

---

# Internationalization (i18n)

*   **Default Support:** English (`en`) and Spanish (`es`).
*   **Routing:** Use SvelteKit's built-in i18n routing capabilities (`prefixDefaultLocale` strategy).
*   **Localized URLs:** URLs must be fully translated and maintain their localized form in the browser's address bar (e.g., `/es/vehiculos/` instead of `/es/vehicles/`). Use the global middleware to perform transparent rewrites from public localized paths to technical English file-system paths. Never allow technical English paths to leak into the URL when a non-English locale is active; implement active redirections if necessary to enforce this.
*   **Dictionaries:** Store translations in modular, type-safe JSON or TypeScript dictionaries organized by domain or page.
*   **Agent Requirement:** Any user-facing string generated by the agent must be extracted to the i18n dictionary and referenced via a translation helper function. Hardcoding strings in UI components is prohibited.

---

# Theming (Light/Dark)

*   **Strategy:** Tailwind's `class` strategy (toggling a `.dark` class on the `<html>` element).
*   **CSS Variables:** Define base colors via CSS variables integrated into Tailwind v4's `@theme` directive. 
*   **Persistence:** The user's theme preference must be stored in `localStorage` and synchronized with the operating system preference using `window.matchMedia('(prefers-color-scheme: dark)')`.
*   **Flash Prevention:** Implement an inline script in the `<head>` to set the theme class before the browser renders the DOM.

---

# PWA Strategy

*   **Manifest:** A fully populated `manifest.webmanifest` must be generated, defining icons, theme colors, display modes (`standalone`), and app name.
*   **Service Worker:** Implement a Service Worker strategy (e.g., via Workbox) to cache static assets, SvelteKit generated pages, and API responses.
*   **Offline Support:** Provide a graceful fallback UI when the application is completely offline.
*   **Lighthouse Checks:** Lighthouse CI will run against PRs to ensure PWA installability and performance criteria are met.

---

# Testing Strategy

1.  **Unit Tests (Vitest):**
    *   Focus on isolated utilities, Zod schemas, state stores (Zustand), and pure UI components.
    *   Coverage minimum: 85% for statements, branches, functions, and lines (aiming for 100%).
2.  **Component Tests (Vitest + Testing Library):**
    *   Test complex interactive Svelte components in isolation.
3.  **End-to-End Tests (Playwright):**
    *   Map critical user journeys (e.g., authentication flow, checkout, data submission).
    *   Tests must run against multiple modern browsers and mobile viewports.
4.  **Performance & Web Vitals (Lighthouse CI):**
    *   Performance score strictly > 90.
    *   Accessibility score strictly > 95.

---

# Automation & Tasks

The project utilizes `just` as a command runner to ensure consistent task execution across environments. All developers and agents should prefer these recipes over direct `bun run` commands.

*   **Setup:** `just setup` (Initial installation and hook preparation)
*   **Development:** `just dev` (Starts SvelteKit dev server)
*   **Verification:** `just check` (Runs lint, typecheck, and coverage)
*   **Testing:** `just test` (Unit tests), `just e2e` (E2E tests)
*   **Build:** `just build` (Production build)
*   **Maintenance:** `just icons` (Regenerates PWA icons)

---

# Folder Structure

The repository must adhere to the following directory tree layout to maintain modularity:

```text
/
├── .husky/                 # Pre-commit hooks configuration
├── .lighthouseci/          # Lighthouse CI assertions
├── playwright/             # E2E test definitions
├── public/                 # Static assets (fonts, icons, manifest, service worker)
├── scripts/                # Automation and maintenance scripts
├── src/
│   ├── assets/             # Unprocessed assets (images, global CSS)
│   ├── components/         # Reusable UI components (pure, stateless where possible)
│   │   ├── ui/             # Generic design system components (buttons, inputs)
│   │   └── domains/        # Feature-specific components
│   ├── i18n/               # Translation dictionaries and utilities
│   ├── layouts/            # SvelteKit layout components (base HTML structure)
│   ├── lib/                # Third-party integrations, utility functions
│   ├── pages/              # SvelteKit file-based routing mechanism
│   ├── schemas/            # Zod validation schemas
│   ├── stores/             # Zustand state slices
│   └── tests/              # Unit and integration tests (or colocated .test.ts files)
├── tests/                  # Playwright E2E configuration and tests
├── svelte.config.ts        # SvelteKit configuration
├── sentry.client.config.ts # Sentry client-side configuration
├── sentry.server.config.ts # Sentry server-side configuration
├── tailwind.css            # Tailwind v4 base styles and @theme definitions
├── Justfile                # Task runner configuration
├── CHANGELOG.md            # Keep a Changelog — updated on every feature change
├── package.json            # Bun package definitions and scripts
└── vitest.config.ts        # Vitest configuration and coverage settings
```

---

## Available Skills

Use these slash commands to trigger specialized agents:

### Project Skills

| Command | Description | File |
|---------|-------------|------|
| `/test` | Run unit/integration tests with Vitest | [`.claude/commands/test.md`](.claude/commands/test.md) |
| `/e2e` | Run end-to-end tests with Playwright | [`.claude/commands/e2e.md`](.claude/commands/e2e.md) |
| `/style` | Manage Tailwind CSS v4 styling and components | [`.claude/commands/style.md`](.claude/commands/style.md) |
| `/validate` | Define and validate Zod schemas | [`.claude/commands/validate.md`](.claude/commands/validate.md) |
| `/state` | Manage Zustand global state stores | [`.claude/commands/state.md`](.claude/commands/state.md) |
| `/git_commit` | Commit changes using conventional commits | [`.claude/commands/git_commit.md`](.claude/commands/git_commit.md) |

### Global Skills

These skills are not project slash commands; they are routed from the agent's global skill set. Invoke them according to their routing rules below.

| Skill | When to use | When NOT to use |
|-------|-------------|-----------------|
| `modern-web-guidance` | **MANDATORY — invoke FIRST** before any HTML/CSS or client-side JS work. It searches a curated index of current web-platform best practices because training weights contain obsolete patterns. Trigger for: UI/layout (modals, dialogs, popovers, **Glassmorphism / backdrop-filter**, anchor positioning, container queries, `:has()`, `:user-valid`), scroll/motion (**View Transitions**, scroll-driven animations, parallax/reveals), performance (**Core Web Vitals** — LCP, INP, `content-visibility`, Fetch Priority, image optimization), system/web APIs (filesystem access, WebUSB, WebSockets, WebAssembly), and general frontend (forms, autofill, advanced inputs, custom scrollbars, modern component states). Adapt the framework-agnostic guides to our SvelteKit + Tailwind v4 setup. | Backend (SQL, ORMs, API routes), CI/CD pipelines (Docker, Actions), generic local scripts, ESLint, or Git operations. |

**Routing**: this skill runs via `npx`, not a slash command:

```sh
# 1. Search use cases with an action-oriented query
npx -y modern-web-guidance@latest search "<query>" --skill-version 2026_05_16-c5e7870
# 2. Retrieve the full guide(s) by id (comma-separated for multiple)
npx -y modern-web-guidance@latest retrieve "<id>"
# Fallback: browse all guides if search is vague or low-similarity
npx -y modern-web-guidance@latest list
```

> Default to **Baseline Widely available** features without fallbacks. For non-Baseline features, follow the guide's fallback recommendations unless a custom browser-support policy is documented here or in `CLAUDE.md`.

### Local Skills (`.agents/skills/`)

Project-local knowledge skills. **`.agents/skills/` is the single source of truth**; `.claude/skills/` contains symlinks to it so both the agent and Claude Code tooling resolve the same files — never create duplicate copies. These are deeper, stack-specific reference layers that complement the project slash commands above (e.g. `svelte-core-bestpractices` backs any `.svelte` edit; `vitest`/`zod`/`zustand` back `/test`, `/validate`, `/state`). Match by **file context** and **task context**, and load the relevant one BEFORE writing code.

| Skill | When to use | Notes / routing |
|-------|-------------|-----------------|
| `svelte-code-writer` | **MANDATORY** whenever creating, editing, or analyzing any `.svelte`, `.svelte.ts`, or `.svelte.js` file. Provides Svelte 5 doc lookup and code analysis. | Runs via CLI: `npx @sveltejs/mcp list-sections` / lookup. Overlaps with the Svelte MCP tools above — prefer the MCP `svelte-autofixer` to validate generated code. |
| `svelte-core-bestpractices` | Load alongside `svelte-code-writer` when writing/editing Svelte components or modules: runes (`$state`, `$derived`, `$effect`), reactivity, event handling, styling, library integration. | Knowledge only — Svelte 5 idioms. |
| `playwright-best-practices` | Writing or debugging Playwright E2E tests: flaky tests, POM, mocking APIs, auth/OAuth, a11y (axe-core), visual/security/perf testing. | Pairs with `/e2e`. |
| `vitest` | Writing or debugging Vitest unit/integration tests: async, mocking with `vi.*`, snapshots, test performance. | Pairs with `/test`. Does NOT cover TDD methodology itself. |
| `zod` | Defining `z.object` schemas, `z.string` validations, `safeParse`, `z.infer`; choosing `parse()` vs `safeParse()`. | Pairs with `/validate`. |
| `zustand` | Working on store code (`src/stores/**`), implementing actions, creating slices, managing global state. | Pairs with `/state`. |
| `schema` | Adding or fixing schema.org structured data / JSON-LD for rich results (FAQ, product, review, breadcrumb). Relevant for the SEO requirements in *Architecture Principles*. | Knowledge only. |
| `web-quality-audit` | On-demand Lighthouse-based audit (Performance, Accessibility, SEO, Best Practices). Use before tuning or to validate against the *Testing Strategy* thresholds. | Complements Lighthouse CI and `chrome-devtools-mcp`. |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Any HTML/CSS or client-side JS feature (glassmorphism, transitions, CWV, forms, etc.) | `modern-web-guidance` (global, FIRST) |
| Creating/editing/analyzing any `.svelte` / `.svelte.ts` / `.svelte.js` file | `svelte-code-writer` + `svelte-core-bestpractices` |
| Writing or updating Vitest tests | `/test` + `vitest` |
| Running or debugging Playwright tests | `/e2e` + `playwright-best-practices` |
| Modifying Tailwind classes or design tokens | `/style` (after `modern-web-guidance`) |
| Creating or updating Zod schemas | `/validate` + `zod` |
| Managing Zustand stores | `/state` + `zustand` |
| Adding structured data / JSON-LD | `schema` |
| Committing changes (general) | `/git_commit` |

---

# Agent Rules & Constraints

1.  **Execution Policy:** Read this `AGENTS.md` before executing any architectural changes.
2.  **No Boilerplate Bloat:** Do not generate unused code. Only write exactly what is required to pass the current TDD cycle.
3.  **Strict Dependencies:** Do not add dependencies via `bun add` without verifying if native SvelteKit, standard DOM APIs, or the existing stack can solve the problem.
4.  **Refusal to Degrade:** If a user requests a change that violates TDD, skips validation, or degrades performance scores below defined thresholds, the agent MUST flag the violation and request confirmation before proceeding.
5.  **Language Continuity:** Maintain bilingual support (es/en) for all newly generated features.
6.  **Git Commits:** Use the global `git-commit` skill for all git operations. Do NOT execute manual `git commit` commands; leverage the skill to ensure conventional commit standards and intelligent staging.
7.  **Design Adherence:** Agents MUST strictly follow the design patterns and architectural aesthetics defined in `DESIGN.md`. Any UI modification that deviates from these patterns without explicit justification is prohibited.
8.  **Changelog Maintenance:** Every time a feature is implemented or updated (and for any user-facing fix or removal), the agent MUST update `CHANGELOG.md` as part of the same change — never as a separate afterthought. See the Changelog Policy below.

---

# Changelog Policy

The project keeps a `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

*   **Mandatory update:** Any change that adds, updates, or removes a feature, or fixes user-facing behavior, MUST add a corresponding entry. This is part of the Development Workflow (step 6) and a hard Agent Rule (#8).
*   **Where:** Add entries under the `## [Unreleased]` heading, grouped by type: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
*   **How:** Write concise, user-facing entries (what changed and why it matters), not raw commit messages. Reference key files only when it aids understanding.
*   **Releases:** When a version is cut, move the `Unreleased` entries under a new `## [x.y.z] - YYYY-MM-DD` heading and bump `package.json` `version` accordingly.
*   **Scope exception:** Purely internal chores with no user-facing or developer-facing impact (e.g. formatting, comment typos) do not require an entry.

---

# Extension Guidelines

To extend this specification:
1. Propose the change via a Pull Request modifying this `AGENTS.md` file.
2. Ensure new technologies do not conflict with the existing SvelteKit/Bun/Tailwind architecture.
3. Update the `Tech Stack` and `Testing Strategy` sections accordingly to reflect new validation requirements.