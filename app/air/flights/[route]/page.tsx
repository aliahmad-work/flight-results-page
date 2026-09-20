import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mockFlightOffers } from "@/data/mock-offers";
import { FlightCard } from "@/components/flights/FlightCard";
import { formatCurrency } from "@/lib/formatters";
import { formatDuration, parseIsoWithOffset } from "@/lib/date-utils";

// Route ISR revalidation: 1 hour (3600 seconds)
export const revalidate = 3600;

interface RoutePageProps {
  params: Promise<{ route: string }>;
}

// 1. Static Generation Params: Pre-render karachi-to-dubai at build time
export async function generateStaticParams() {
  return [{ route: "karachi-to-dubai" }];
}

// 2. SEO Metadata Generation
export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { route } = await params;
  if (route !== "karachi-to-dubai") {
    return { title: "Route Not Found" };
  }

  return {
    title: "Flights from Karachi to Dubai (KHI to DXB) | Flight Deals & Schedules",
    description:
      "Compare direct flight deals and schedules from Karachi (KHI) to Dubai (DXB). Operating airlines include Emirates, FlyDubai, PIA, and Airblue.",
  };
}

export default async function FlightRoutePage({ params }: RoutePageProps) {
  const { route } = await params;

  // Enforce supported route check
  if (route !== "karachi-to-dubai") {
    notFound();
  }

  // Filter factual Karachi -> Dubai offers directly from data model (build time)
  const routeOffers = mockFlightOffers.filter(
    (offer) =>
      offer.origin.code.toUpperCase() === "KHI" &&
      offer.destination.code.toUpperCase() === "DXB"
  );

  if (routeOffers.length === 0) {
    notFound();
  }

  // Derive factual statistics solely from the matching mock offers
  let minPrice = Infinity;
  let fastestMinutes = Infinity;
  const airlinesSet = new Set<string>();
  const earliestDep = parseIsoWithOffset(routeOffers[0].departureTime);
  const latestDep = parseIsoWithOffset(routeOffers[routeOffers.length - 1].departureTime);

  routeOffers.forEach((o) => {
    if (o.price < minPrice) minPrice = o.price;
    if (o.totalDurationMinutes < fastestMinutes) fastestMinutes = o.totalDurationMinutes;
    airlinesSet.add(o.airline);
  });

  const operatingAirlines = Array.from(airlinesSet);
  const originAirport = routeOffers[0].origin;
  const destinationAirport = routeOffers[0].destination;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. Header / Breadcrumb Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center space-x-2 text-xs text-gray-500">
              <li>
                <Link href="/air/search" className="hover:text-blue-600 transition-colors">
                  Flight Search
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-400">Routes</span>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="font-medium text-gray-900" aria-current="page">
                Karachi to Dubai
              </li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Flights from {originAirport.city} ({originAirport.code}) to {destinationAirport.city} ({destinationAirport.code})
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Direct scheduled flights connecting {originAirport.airport} to {destinationAirport.airport}
              </p>
            </div>

            {/* Primary Live Search CTA */}
            <Link
              href="/air/search?origin=KHI&destination=DXB"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow-xs self-start sm:self-auto"
            >
              Search All Live Dates ✈
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Derived Route Highlights Section */}
        <section aria-labelledby="route-summary-heading" className="space-y-4">
          <h2 id="route-summary-heading" className="text-base font-bold text-gray-900">
            Route Overview & Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Stat 1: Lowest Fare */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-gray-500 block">Lowest Starting Fare</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 mt-1 block">
                {formatCurrency(minPrice)}
              </span>
            </div>

            {/* Stat 2: Fastest Flight Time */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-gray-500 block">Shortest Flight Duration</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900 mt-1 block">
                {formatDuration(fastestMinutes)}
              </span>
            </div>

            {/* Stat 3: Direct Carriers */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-gray-500 block">Operating Airlines</span>
              <span className="text-sm sm:text-base font-semibold text-gray-900 mt-1 block truncate" title={operatingAirlines.join(", ")}>
                {operatingAirlines.length} Carriers
              </span>
            </div>

            {/* Stat 4: Scheduled Departures */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-xs text-gray-500 block">Daily Direct Flights</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600 mt-1 block">
                {routeOffers.length} Flights
              </span>
            </div>
          </div>
        </section>

        {/* Available Scheduled Offers on Route */}
        <section aria-labelledby="scheduled-offers-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="scheduled-offers-heading" className="text-base font-bold text-gray-900">
              Scheduled Flight Offers ({routeOffers.length})
            </h2>
            <span className="text-xs text-gray-500">
              Departure times shown in origin (+05:00) / destination (+04:00) local times
            </span>
          </div>

          <ul className="space-y-4" role="list" aria-label="Available flights from Karachi to Dubai">
            {routeOffers.map((offer) => (
              <FlightCard key={offer.id} offer={offer} />
            ))}
          </ul>
        </section>

        {/* Operating Airlines & Airport Guide Section */}
        <section aria-labelledby="route-details-heading" className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <h2 id="route-details-heading" className="text-base font-bold text-gray-900">
            Airlines Operating on this Route
          </h2>
          <div className="flex flex-wrap gap-2">
            {operatingAirlines.map((airline) => (
              <span
                key={airline}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200"
              >
                ✈ {airline}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Ready to Book or Check More Dates?</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Explore real-time availability, apply airline filters, and select fare options on our search engine.
              </p>
            </div>
            <Link
              href="/air/search?origin=KHI&destination=DXB"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap"
            >
              Search Karachi → Dubai
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
