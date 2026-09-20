# Caching Architecture & Revalidation Strategy

This document details the caching and revalidation strategy implemented in the Flight Results application. It outlines what is cached, what is intentionally dynamic/uncached, how `/air/search` participates in the data flow, and the technical consequences if these decisions were inverted.

---

## 1. What is Cached / Revalidated

### Route: `/air/flights/karachi-to-dubai` (`app/air/flights/[route]/page.tsx`)

- **Rendering Strategy**: Incremental Static Regeneration (ISR) via static pre-rendering.
- **Next.js Configuration**:
  - `export async function generateStaticParams()`: Statically renders the `karachi-to-dubai` route at build time.
  - `export const revalidate = 3600;`: Revalidates the page periodically in the background every 1 hour (3600 seconds).
- **Architectural Rationale**:
  - High-traffic corridor landing pages serve primarily as search engine entry points (SEO) and marketing summaries (lowest starting fare, shortest duration, operating carriers).
  - General route schedule metadata and benchmark prices change infrequently compared to live seat availability.
  - Pre-rendering at build time with hourly ISR allows edge-cached, sub-millisecond TTFB (Time to First Byte) without placing repetitive computational load on upstream inventory services.

---

## 2. What is Intentionally NOT Cached

### Route: `/api/offers` (`app/api/offers/route.ts`)

- **Rendering Strategy**: Uncached, fully dynamic API route handler.
- **Next.js Configuration & Headers**:
  - `export const dynamic = "force-dynamic";`
  - `export const revalidate = 0;`
  - Explicit HTTP response headers:
    ```http
    Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
    Pragma: no-cache
    Expires: 0
    ```
- **Architectural Rationale**:
  - Flight pricing, fare buckets, seat availability, and upstream supplier status (GDS timeouts, carrier feed dropouts) are real-time, volatile data.
  - In aviation systems, serving cached fare data leads to "stale fare bounce" where a customer sees a low cached price on the results page that changes or fails when attempting to book.
  - Furthermore, API simulation states (`?simulate=slow`, `?simulate=error`, `?simulate=empty`, `?simulate=partial`) require fresh execution on every request to accurately model unpredictable supplier health.

---

## 3. Dynamic Data Flow: `/air/search` (`app/air/search/page.tsx`)

- **Rendering Strategy**: Dynamic Server-Rendered Page (`export const dynamic = "force-dynamic"`, `export const revalidate = 0`).
- **Data Flow & URL State**:
  - The search page receives search parameters asynchronously (`searchParams: Promise<{ ... }>`).
  - It wraps results in `<Suspense key={JSON.stringify(resolvedParams)} fallback={<ResultsSkeleton />}>` to enable immediate streaming of the layout while offers are fetched.
  - Inside the async Server Component (`<FlightResultsContainer />`), data is fetched from `/api/offers` using `fetch(endpoint, { cache: "no-store" })`.
  - Filtering (stops, airlines, price ranges, origin/destination) and sorting (`cheapest`, `fastest`, `earliest`, `latest`) execute server-side on each request based directly on the URL query parameters.
  - Because all filter interactions update the URL via `router.push(..., { scroll: false })`, the server dynamically recalculates the faceted counts, min/max price bounds, and active offers without stale client cache drift.

---

## 4. What Breaks If Decisions Were Reversed

| Reversal Scenario | What Breaks in Practice |
| :--- | :--- |
| **If `/api/offers` & live search results were cached** | 1. **Fare Inaccuracy & Booking Failures**: Stale prices and seat availability would be served. Users would see discounted fares that are no longer bookable.<br>2. **Broken Supplier Failure Detection**: If a supplier experiences an outage (modeled by `simulate=error` or `simulate=partial`), a cached response would mask the failure, presenting phantom inventory.<br>3. **Stale Filter States**: Users filtering or sorting would risk receiving mismatched cached responses across search parameter combinations. |
| **If `/air/flights/karachi-to-dubai` were uncached / dynamic** | 1. **Wasted Compute & Increased Latency**: High-volume search engine crawlers and landing page visitors would trigger redundant server renders and database/model queries on every page hit.<br>2. **Loss of Edge Caching**: Search landing pages would lose CDN edge caching benefits, increasing server hosting costs and degrading SEO Core Web Vitals (LCP/TTFB). |

---

## 5. Architectural Summary Table

| Route / Resource | Next.js Mechanism | Cache Behavior | Upstream Impact |
| :--- | :--- | :--- | :--- |
| `/air/flights/[route]` | `generateStaticParams` + `revalidate = 3600` | Statically generated & ISR (1 hour) | Minimal (cached at edge) |
| `/air/search` | `dynamic = "force-dynamic"`, `revalidate = 0` | Server-rendered per request (URL-driven) | Live render with streaming Suspense |
| `/api/offers` | `dynamic = "force-dynamic"`, `cache: "no-store"` | Never cached (`no-store`, `no-cache`) | Real-time fare and supplier evaluation |

---

## 6. Trade-offs: Freshness vs. Performance

The architecture deliberately adopts a hybrid approach:

- **Aggressive Edge Performance for SEO**: Static route landing pages prioritize performance, CDN caching, and low TTFB over second-by-second fare precision, accepting an hourly revalidation window to keep route summary stats fresh.
- **Strict Data Integrity for Search & Booking**: The search engine (`/air/search`) and API layer (`/api/offers`) prioritize strict data freshness and supplier state accuracy over caching speed, relying on server-side streaming (`Suspense` + skeletons) to deliver a responsive user experience while guaranteeing that all displayed inventory and pricing are live.
