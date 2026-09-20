# Flight Results Application

A high-performance, accessible, and reviewer-friendly synthetic flight-search and results application built with Next.js App Router (v16.3.5), React 19, TypeScript, and Tailwind CSS v4.

---

# Overview

This project is a synthetic flight-results application developed for a technical assessment evaluating frontend engineering capabilities with the Next.js App Router. It models real-world airline search workflows, multi-supplier API simulation states (fast, slow, error, empty, partial inventory), URL-driven filtering and sorting, and statically pre-rendered route landing pages.

All airline offers, schedules, airports, and supplier behaviours are synthetic mock data modeled strictly for evaluation and demonstration purposes; the application does not make live booking transactions or connect to live proprietary airline reservation systems.

---

# Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) `16.3.5` (App Router, Turbopack, Server Components, Route Handlers)
- **Library**: [React](https://react.dev/) `19.2.8` & [React DOM](https://react.dev/) `19.2.8`
- **Language**: [TypeScript](https://www.typescriptlang.org/) `^5`
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) `^4` (via `@tailwindcss/postcss`)
- **Linting**: [ESLint](https://eslint.org/) `^9` (`eslint-config-next` `16.3.5`)
- **Fonts**: `next/font/google` (`Geist`, `Geist_Mono`)

---

# Getting Started

Follow these steps to clone, install, and run the project locally. Setup takes approximately 2–3 minutes.

### Prerequisites

- **Node.js**: `v18.18+` or `v20+` recommended
- **Package Manager**: `npm` (comes with Node.js)

### Installation

```bash
npm install
```

### Development Server

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or navigate directly to the flight search page at [http://localhost:3000/air/search](http://localhost:3000/air/search).

### Production Build & Start

To build and run the optimized production bundle:

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

---

# Application Routes

The application implements the following core routes:

| Route | Type | Description |
| :--- | :--- | :--- |
| [`/air/search`](http://localhost:3000/air/search) | **Dynamic (Server-Rendered)** | The primary flight results page. Reads URL query parameters for search context, filtering, sorting, and simulation states, fetches offers dynamically from `/api/offers`, and renders interactive filters and offer cards. |
| [`/api/offers`](http://localhost:3000/api/offers) | **Route Handler (Dynamic API)** | Server API endpoint serving synthetic flight offers with support for latency simulation, 503 supplier error responses, empty payloads, and partial inventory feed dropouts with supplier warnings. Uses `export const dynamic = "force-dynamic"`, `revalidate = 0`, and `Cache-Control: no-store` headers. |
| [`/air/flights/karachi-to-dubai`](http://localhost:3000/air/flights/karachi-to-dubai) | **Static / ISR (`revalidate = 3600`)** | High-traffic SEO landing page pre-rendered at build time via `generateStaticParams`. Displays route metadata, direct flight summary statistics (lowest price, shortest duration, carrier count), scheduled flights, and direct deep-links into the live search page. |
| [`/`](http://localhost:3000/) | **Static** | Default starter home page. |

---

# Testing the Required States

The application supports five built-in API simulation modes via the `simulate` query parameter. These can be tested either by clicking the buttons on the persistent **API Simulation Bar** at the top of `/air/search` or by loading the exact URLs below:

### 1. Default Success (`simulate=ok`)
- **URL**: [http://localhost:3000/air/search?simulate=ok](http://localhost:3000/air/search?simulate=ok) (or simply [http://localhost:3000/air/search](http://localhost:3000/air/search))
- **Expected Result**: HTTP 200 OK. Returns full flight catalog across all corridors (Pakistan to Gulf, London, etc.) with functional sidebar filters, sort controls, and active filter chips.

### 2. Slow Response (`simulate=slow`)
- **URL**: [http://localhost:3000/air/search?simulate=slow](http://localhost:3000/air/search?simulate=slow)
- **Expected Result**: HTTP 200 OK with an intentional 2500ms server delay. Demonstrates Next.js streaming `Suspense` and the `<ResultsSkeleton />` fallback UI while the server resolves the offer payload.

### 3. Supplier Error (`simulate=error`)
- **URL**: [http://localhost:3000/air/search?simulate=error](http://localhost:3000/air/search?simulate=error)
- **Expected Result**: HTTP 503 Service Unavailable (`SUPPLIER_GATEWAY_TIMEOUT`). Triggers the `<ErrorState />` UI with descriptive error messaging and an interactive **Retry Search** button that triggers server refresh.

### 4. Empty Results (`simulate=empty`)
- **URL**: [http://localhost:3000/air/search?simulate=empty](http://localhost:3000/air/search?simulate=empty)
- **Expected Result**: HTTP 200 OK with `offers: []` (`totalResults: 0`). Displays the `<EmptyState />` UI informing the user that no flights were found.

### 5. Partial Inventory Feeds (`simulate=partial`)
- **URL**: [http://localhost:3000/air/search?simulate=partial](http://localhost:3000/air/search?simulate=partial)
- **Expected Result**: HTTP 200 OK with a subset of offers (Qatar Airways and British Airways inventory dropped) alongside a `<SupplierWarnings />` notice detailing upstream supplier timeouts and failures for the missing carriers.

---

# URL-Driven Search State

All search parameters, filters, sorting options, and simulation modes are stored as search parameters in the URL. This ensures all states are bookmarkable, shareable, and resilient to page refreshes or browser Back/Forward navigation.

### Supported URL Parameters

| Parameter | Type | Example Values | Description |
| :--- | :--- | :--- | :--- |
| `origin` | String | `KHI`, `LHE`, `ISB` | Departure airport code or city name filter |
| `destination` | String | `DXB`, `LHR`, `DOH`, `AUH`, `JED` | Destination airport code or city name filter |
| `date` | String | `15 Oct 2026` | Departure date context displayed in header |
| `cabin` | String | `Economy`, `Business` | Cabin class context displayed in header |
| `stops` | Comma-separated | `0`, `1`, `0,1` | Filter by number of stops (`0` = Direct, `1` = 1 stop) |
| `airlines` | Comma-separated | `EK,FZ`, `PA,PK,QR` | Filter by 2-letter airline IATA codes |
| `minPrice` | Number | `50000` | Minimum price threshold in PKR |
| `maxPrice` | Number | `150000` | Maximum price threshold in PKR |
| `sort` | String | `cheapest`, `fastest`, `earliest`, `latest` | Sorting criteria (defaults to `cheapest`) |
| `simulate` | String | `ok`, `slow`, `error`, `empty`, `partial` | API simulation mode |

### Example Comprehensive URLs

- **Filtered & Sorted Search**:
  ```
  http://localhost:3000/air/search?origin=KHI&destination=DXB&stops=0&airlines=EK,FZ&sort=fastest
  ```
- **Price Range & Cabin Class**:
  ```
  http://localhost:3000/air/search?origin=KHI&destination=LHR&maxPrice=250000&sort=cheapest
  ```
- **Partial Simulation with Active Filters**:
  ```
  http://localhost:3000/air/search?simulate=partial&stops=1&sort=earliest
  ```

Filter changes in client components invoke Next.js `useTransition` and `router.push(..., { scroll: false })` via the custom `useSearchFilters` hook, ensuring non-blocking transitions without full page reloads.

---

# Architecture

The application is structured using Next.js App Router patterns to balance server performance, SEO, and client-side interactivity:

```
[Browser Client]
       │
       ▼
 [app/air/search/page.tsx] (Server Component, dynamic = "force-dynamic")
       │
       ├── <SimulationBar /> (Client Component: mode switcher)
       ├── <SearchHeader /> (Server Component: route & date context)
       │
       └── <Suspense key={params} fallback={<ResultsSkeleton />}>
             └── <FlightResultsContainer /> (Async Server Component)
                   │
                   ├── Fetch data from /api/offers?simulate=...
                   ├── Server-side filtering (stops, airlines, price, route)
                   ├── Server-side sorting (cheapest, fastest, earliest, latest)
                   │
                   ├── <SupplierWarnings /> (Server Component: partial feed alerts)
                   ├── <FilterSidebar /> (Client Component: desktop filter controls)
                   ├── <MobileFilterDialog /> (Client Component: responsive filter modal)
                   ├── <SortDropdown /> (Client Component: sort selector)
                   ├── <ActiveFiltersBar /> (Client Component: removable filter chips)
                   ├── <ErrorState /> / <EmptyState /> (Client Components: interactive retry / reset)
                   └── <FlightResultsList /> ──▶ <FlightCard /> (Server Components: render offers)
```

### Server vs. Client Component Boundaries

- **Server Components (Default)**:
  - `FlightSearchPage` (`app/air/search/page.tsx`): Resolves asynchronous `searchParams` and establishes layout boundaries.
  - `FlightResultsContainer` (`components/flights/FlightResultsContainer.tsx`): Executes server-side data fetching from `/api/offers`, computes faceted counts/ranges, applies filter and sort logic, and handles error/warning states on the server.
  - `FlightResultsList` & `FlightCard` (`components/flights/`): Render static flight cards, times, stops, badges, and fare breakdowns with zero client-side JavaScript overhead.
  - `SearchHeader` (`components/flights/SearchHeader.tsx`): Renders breadcrumbs and route parameters.
  - `FlightRoutePage` (`app/air/flights/[route]/page.tsx`): Pre-renders static route summary pages for SEO.

- **Client Components (`"use client"` marked strictly where interactivity is required)**:
  - `SimulationBar`: Manages simulation mode click interactions and URL updates.
  - `FilterSidebar`: Handles checkbox toggles, range slider events, and filter reset.
  - `MobileFilterDialog`: Manages mobile drawer modal state, focus trapping, and keyboard `Escape` listening.
  - `SortDropdown`: Handles sort select `onChange` events.
  - `ActiveFiltersBar`: Handles individual chip removal clicks.
  - `ErrorState` & `EmptyState`: Provide interactive `router.refresh()` retry triggers and `clearFilters()` resets.

---

# Caching Strategy

The caching architecture distinguishes between real-time, dynamic fare results and static, search-engine-optimized marketing routes:

1. **Dynamic Real-Time Results (`/air/search` and `/api/offers`)**:
   - **Strategy**: Uncached dynamic execution (`dynamic = "force-dynamic"`, `revalidate = 0`).
   - **Headers**: API responses send `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`.
   - **Rationale**: Flight pricing and seat availability in aviation systems are volatile and must never serve stale cache results when users adjust filters or request fresh inventory.

2. **Static Route Landing Pages (`/air/flights/[route]`)**:
   - **Strategy**: Incremental Static Regeneration (ISR) with `export const revalidate = 3600` (1 hour) and build-time static parameter generation (`generateStaticParams`).
   - **Rationale**: Route landing pages (e.g. `/air/flights/karachi-to-dubai`) serve as SEO entry points containing schedule summaries and lowest starting fares that change infrequently and benefit from instant edge-cached delivery.

For an in-depth architectural breakdown and caching comparison matrix, refer to [`CACHING.md`](./CACHING.md).

---

# Accessibility

The application has been designed and implemented in accordance with WCAG 2.1 AA accessibility guidelines:

- **Semantic HTML & Document Structure**:
  - Valid heading hierarchy (`<h1>` for route headers, `<h2>` for filter and overview sections, `<h3>` for flight card titles).
  - Landmark regions (`<header>`, `<main>`, `<aside>`, `<nav>`).
  - Search results presented in a semantic unordered list (`<ul role="list" aria-label="...">`) with individual `<li>` cards.
- **Form Controls & Grouping**:
  - Filter sections wrapped in `<fieldset>` with explicit `<legend>` elements (`Stops`, `Airlines`).
  - All checkboxes and range inputs bound to explicit `<label>` tags with matching `htmlFor` / `id` pairs.
- **Live Regions (`aria-live`)**:
  - Results counter uses `aria-live="polite"` and `aria-atomic="true"` (`Showing X flight offers`) to announce result count updates to screen reader users as filters change.
- **Mobile Filter Modal Accessibility**:
  - Implements `role="dialog"`, `aria-modal="true"`, and `aria-label="Filter flight offers"`.
  - **Focus Trapping**: Cycles `Tab` and `Shift+Tab` within focusable dialog elements when open.
  - **Keyboard Dismissal**: Closes immediately on `Escape` key press.
  - **Focus Restoration**: Automatically restores focus to the filter trigger button when closed.
- **Visual Focus & Keyboard Navigation**:
  - All interactive elements (buttons, selects, links, checkboxes) feature high-contrast `focus-visible:outline-2` focus rings.
  - Flight cards feature accessible `aria-label` summaries and clear select CTAs.
- **Responsive Layout & Zoom**:
  - Tested for layout integrity at 200% browser zoom and mobile screen widths (320px–768px).

For complete Lighthouse audit scores and verification details, refer to [`AUDIT.md`](./AUDIT.md).

---

# Correctness Details

### 1. PKR Currency Formatting
- Formatted using `Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 })` via `lib/formatters.ts`.
- Formats amounts cleanly (e.g., `PKR 84,500`) with zero unnecessary decimal places and provides a safe fallback string formatter if locale parsing fails.

### 2. Timezone & Offset Handling
- Flight departures and arrivals are stored in ISO 8601 strings with explicit regional timezone offsets (e.g. `2026-10-15T09:30:00+05:00` for Pakistan PKT and `2026-10-15T10:45:00+04:00` for UAE GST).
- Parsed using a custom deterministic regex parser in `lib/date-utils.ts` (`parseIsoWithOffset`).
- **Hydration Safety**: Dates and local departure/arrival times are extracted directly from the ISO string without converting to the client machine's browser timezone. This eliminates SSR vs. CSR hydration mismatch bugs regardless of where the reviewer is located geographically.
- Local time offsets (e.g. `+05:00`, `+04:00`, `+01:00`) are explicitly rendered in visual chips next to flight timestamps.

---

# Testing & Verification

The repository has been verified using the following automated tools and manual review workflows:

### Automated Checks
- **ESLint**: Passed with zero errors (`npm run lint`).
- **TypeScript**: Passed with strict type checking enabled (`tsconfig.json`).
- **Production Build**: Verified cleanly with Next.js Turbopack compiler (`npm run build`).

### Manual Verification Checklist
- [x] **Default Results (`simulate=ok`)**: Verified 20+ synthetic flight offers across regional and international routes.
- [x] **Slow State (`simulate=slow`)**: Verified 2500ms delay and `<ResultsSkeleton />` loading state.
- [x] **Error State (`simulate=error`)**: Verified 503 error UI and "Retry Search" button functionality.
- [x] **Empty State (`simulate=empty`)**: Verified zero-results UI with "Clear Active Filters" button.
- [x] **Partial State (`simulate=partial`)**: Verified supplier warning alert banners and filtered airline lists.
- [x] **Filtering**: Verified single and multi-selection for stops (Direct / 1 Stop), airlines (EK, FZ, PA, PK, QR, BA, SV, EY, G9), and maximum price slider.
- [x] **Sorting**: Verified sorting by cheapest price, fastest duration, earliest departure, and latest departure.
- [x] **Active Filter Chips**: Verified dynamic chip rendering and individual chip removal.
- [x] **URL State Persistence**: Verified that refreshing or sharing URL faithfully restores all filter, sort, and simulation criteria.
- [x] **Browser History**: Verified forward and back button navigation updates results seamlessly.
- [x] **Keyboard Navigation**: Verified full tab-navigation, Enter/Space activation, and visible focus rings.
- [x] **Mobile Dialog**: Verified modal open/close, focus trapping inside dialog, Escape key dismissal, and focus restoration to trigger button.
- [x] **Static Route**: Verified `/air/flights/karachi-to-dubai` renders statically with derived route statistics.

---

# Known Gaps / Limitations

1. **Single-Way Search Focus**: The current synthetic UI focuses primarily on one-way flight search journeys; round-trip return date selection is not implemented in the mock data model.
2. **Mock Booking Action**: Clicking "Select Flight" on an offer card triggers focus/selection feedback but does not transition to a checkout/passenger details page as booking is outside the scope of this results-page assessment.
3. **Multi-Stop Segment Expansion**: Multi-leg flights display total duration, layover count, and stop airport codes (e.g. `1 Stop (DXB)`), but do not include an expandable accordion for individual intermediate layover lay durations.

---

# Trade-offs

- **Server-Side Filtering vs. Client-Side State**: Filters are processed on the server inside `FlightResultsContainer` via URL parameters rather than keeping an in-memory client state array. This trade-off requires a quick server round-trip on filter change, but guarantees bookmarkable URLs, server-side rendering, lower client memory footprint, and identical behavior for web crawlers.
- **Custom ISO String Parser vs. Heavy Date Libraries**: Implemented a lightweight regex parser (`lib/date-utils.ts`) instead of importing heavy date packages (`moment`, `date-fns`). This keeps the bundle size minimal while guaranteeing zero timezone hydration mismatch between server and client.
- **Tailwind CSS v4 `@tailwindcss/postcss`**: Leveraged Tailwind CSS v4 for zero-configuration CSS variables and modern CSS utility performance.

---

# What I Would Improve Next

With additional engineering time, the following enhancements would be prioritized:

1. **Expandable Leg Details Accordion**: Add an expandable drawer to each `FlightCard` showing detailed aircraft type, seat pitch, terminal changes, and layover lay durations between flight legs.
2. **Date Matrix / Fare Carousel**: Implement a 7-day lowest-fare calendar strip above the results list allowing users to quickly jump between dates with the lowest prices.
3. **Automated End-to-End Testing**: Add a Playwright test suite to automatically test URL parameter manipulation, keyboard navigation, filter dialog focus trapping, and simulation modes in CI.
4. **Optimistic UI Transitions**: Enhance filter toggles with optimistic UI state transitions while the server-rendered results stream in.

---

# Project Structure

```
flight-results-page/
├── app/
│   ├── air/
│   │   ├── flights/
│   │   │   └── [route]/
│   │   │       └── page.tsx              # Static ISR SEO route (/air/flights/karachi-to-dubai)
│   │   └── search/
│   │       ├── loading.tsx               # Next.js Suspense loading page
│   │       └── page.tsx                  # Main dynamic search page (/air/search)
│   ├── api/
│   │   └── offers/
│   │       └── route.ts                  # Offers API route handler (dynamic, no-cache)
│   ├── favicon.ico
│   ├── globals.css                       # Global Tailwind CSS styles
│   ├── layout.tsx                        # Root layout with Geist font configuration
│   └── page.tsx                          # Root index page
├── components/
│   └── flights/
│       ├── ActiveFiltersBar.tsx          # Removable filter pill chips (Client Component)
│       ├── EmptyState.tsx                # Zero-results state UI (Client Component)
│       ├── ErrorState.tsx                # 503 error state & retry UI (Client Component)
│       ├── FilterSidebar.tsx             # Stops, airlines, and price filters (Client Component)
│       ├── FlightCard.tsx                # Flight card presentation (Server Component)
│       ├── FlightResultsContainer.tsx    # Server data fetcher & filter orchestrator (Server Component)
│       ├── FlightResultsList.tsx         # Results list wrapper (Server Component)
│       ├── MobileFilterDialog.tsx        # Accessible mobile modal drawer (Client Component)
│       ├── ResultsSkeleton.tsx           # Skeleton loading state UI (Server Component)
│       ├── SearchHeader.tsx              # Route and date context header (Server Component)
│       ├── SimulationBar.tsx             # Simulation state switcher (Client Component)
│       ├── SortDropdown.tsx              # Sort criteria selector (Client Component)
│       └── SupplierWarnings.tsx          # Partial inventory feed warning banner (Server Component)
├── data/
│   └── mock-offers.ts                    # 20+ realistic synthetic flight offers & schedules
├── lib/
│   ├── date-utils.ts                     # Timezone-safe ISO date & duration formatters
│   ├── formatters.ts                     # Currency formatting (PKR)
│   └── use-search-filters.ts             # Custom hook for URL search parameter management
├── types/
│   └── flight.ts                         # TypeScript interfaces for offers, APIs, & filters
├── AUDIT.md                              # Accessibility, performance, & WCAG audit report
├── CACHING.md                            # Caching strategy & revalidation documentation
├── package.json                          # Dependencies and scripts
├── postcss.config.mjs                    # PostCSS configuration for Tailwind CSS v4
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # Reviewer guide and technical documentation
```

---

# Assessment Deliverables

The following deliverables are included in this submission:

1. **Flight Results Application**: Full Next.js App Router codebase implementing search results, filters, sorting, and responsive UI.
2. **Synthetic Offers Dataset**: Comprehensive dataset in `data/mock-offers.ts` with authentic regional & international airline schedules, IATA codes, and multi-segment legs.
3. **Simulation Test Suite**: Implemented via `/api/offers?simulate=...` and interactive UI toolbar.
4. **`README.md`**: Complete technical overview, architecture explanation, and reviewer verification guide (this document).
5. **`CACHING.md`**: Dedicated architectural document explaining dynamic data fetching vs. ISR caching strategy.
6. **`AUDIT.md`**: Comprehensive WCAG 2.1 AA accessibility audit, keyboard navigation evaluation, and Lighthouse performance verification.
