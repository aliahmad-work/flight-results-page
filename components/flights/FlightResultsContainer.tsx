import React from "react";
import { headers } from "next/headers";
import {
  FlightOffer,
  OffersApiResponse,
  OffersApiErrorResponse,
} from "@/types/flight";
import { FlightResultsList } from "./FlightResultsList";
import { SupplierWarnings } from "./SupplierWarnings";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { SortDropdown } from "./SortDropdown";
import { ActiveFiltersBar } from "./ActiveFiltersBar";
import { FilterSidebar, AvailableFilterOption } from "./FilterSidebar";
import { MobileFilterDialog } from "./MobileFilterDialog";

interface FlightResultsContainerProps {
  searchParams: Record<string, string | string[] | undefined>;
}

async function fetchOffersFromServer(simulate?: string): Promise<{
  data?: OffersApiResponse;
  error?: OffersApiErrorResponse;
  status: number;
}> {
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

    const endpoint = `${proto}://${host}/api/offers${
      simulate ? `?simulate=${encodeURIComponent(simulate)}` : ""
    }`;

    const res = await fetch(endpoint, {
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) {
      return { error: json, status: res.status };
    }
    return { data: json, status: res.status };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Network error";
    return {
      status: 500,
      error: {
        success: false,
        simulationMode: "error",
        error: {
          code: "INTERNAL_FETCH_ERROR",
          message: `Could not connect to /api/offers: ${errorMessage}`,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
    };
  }
}

export async function FlightResultsContainer({
  searchParams,
}: FlightResultsContainerProps) {
  const simulate = typeof searchParams.simulate === "string" ? searchParams.simulate : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "cheapest";

  // Parse filters from URL
  const stopsFilter = typeof searchParams.stops === "string"
    ? searchParams.stops.split(",").filter(Boolean)
    : [];

  const airlinesFilter = typeof searchParams.airlines === "string"
    ? searchParams.airlines.split(",").filter(Boolean)
    : [];

  const minPriceFilter = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPriceFilter = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;

  // Search context
  const originParam = typeof searchParams.origin === "string" ? searchParams.origin.toUpperCase() : undefined;
  const destinationParam = typeof searchParams.destination === "string" ? searchParams.destination.toUpperCase() : undefined;

  // 1. Fetch offers from /api/offers
  const { data, error, status } = await fetchOffersFromServer(simulate);

  // 2. Handle HTTP Errors (e.g. ?simulate=error -> 503)
  if (!data || error || status >= 400) {
    return (
      <div className="w-full py-6">
        <ErrorState
          statusCode={status}
          message={error?.error?.message || "Failed to retrieve flight offers from our airline suppliers."}
        />
      </div>
    );
  }

  const rawOffers: FlightOffer[] = data.offers || [];

  // Compute available filter metadata from the raw dataset
  let globalMinPrice = Infinity;
  let globalMaxPrice = 0;
  const airlinesMap: Record<string, { code: string; name: string; minPrice: number; count: number }> = {};
  const stopsCounts: Record<number, { count: number; minPrice: number }> = {
    0: { count: 0, minPrice: Infinity },
    1: { count: 0, minPrice: Infinity },
    2: { count: 0, minPrice: Infinity },
  };

  rawOffers.forEach((offer) => {
    if (offer.price < globalMinPrice) globalMinPrice = offer.price;
    if (offer.price > globalMaxPrice) globalMaxPrice = offer.price;

    // Airlines aggregations
    if (!airlinesMap[offer.airlineCode]) {
      airlinesMap[offer.airlineCode] = {
        code: offer.airlineCode,
        name: offer.airline,
        minPrice: offer.price,
        count: 1,
      };
    } else {
      airlinesMap[offer.airlineCode].count++;
      if (offer.price < airlinesMap[offer.airlineCode].minPrice) {
        airlinesMap[offer.airlineCode].minPrice = offer.price;
      }
    }

    // Stops aggregations
    const stp = offer.stopsCount;
    if (stopsCounts[stp] !== undefined) {
      stopsCounts[stp].count++;
      if (offer.price < stopsCounts[stp].minPrice) {
        stopsCounts[stp].minPrice = offer.price;
      }
    }
  });

  const availableAirlines: AvailableFilterOption[] = Object.values(airlinesMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const availableAirlinesLookup: Record<string, string> = {};
  availableAirlines.forEach((a) => {
    availableAirlinesLookup[a.code] = a.name;
  });

  const stopsOptions = [
    {
      stops: 0,
      label: "Direct (Non-stop)",
      count: stopsCounts[0]?.count || 0,
      minPrice: stopsCounts[0]?.minPrice !== Infinity ? stopsCounts[0]?.minPrice : undefined,
    },
    {
      stops: 1,
      label: "1 Stop",
      count: stopsCounts[1]?.count || 0,
      minPrice: stopsCounts[1]?.minPrice !== Infinity ? stopsCounts[1]?.minPrice : undefined,
    },
  ].filter((s) => s.count > 0);

  const priceRange = {
    min: globalMinPrice !== Infinity ? globalMinPrice : 0,
    max: globalMaxPrice > 0 ? globalMaxPrice : 1000000,
  };

  // 3. Filter the offers server-side
  let filteredOffers = rawOffers.filter((offer) => {
    // Route origin/destination filter if provided
    if (originParam && offer.origin.code.toUpperCase() !== originParam && offer.origin.city.toUpperCase() !== originParam) {
      return false;
    }
    if (destinationParam && offer.destination.code.toUpperCase() !== destinationParam && offer.destination.city.toUpperCase() !== destinationParam) {
      return false;
    }

    // Stops filter
    if (stopsFilter.length > 0) {
      if (!stopsFilter.includes(String(offer.stopsCount))) {
        return false;
      }
    }

    // Airlines filter
    if (airlinesFilter.length > 0) {
      if (!airlinesFilter.includes(offer.airlineCode)) {
        return false;
      }
    }

    // Min / Max Price
    if (typeof minPriceFilter === "number" && offer.price < minPriceFilter) {
      return false;
    }
    if (typeof maxPriceFilter === "number" && offer.price > maxPriceFilter) {
      return false;
    }

    return true;
  });

  // 4. Sort the filtered offers
  filteredOffers = filteredOffers.sort((a, b) => {
    if (sort === "fastest") {
      return a.totalDurationMinutes - b.totalDurationMinutes;
    }
    if (sort === "earliest") {
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    }
    if (sort === "latest") {
      return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();
    }
    // Default: "cheapest"
    return a.price - b.price;
  });

  const activeFiltersCount =
    stopsFilter.length +
    airlinesFilter.length +
    (typeof minPriceFilter === "number" ? 1 : 0) +
    (typeof maxPriceFilter === "number" && maxPriceFilter < priceRange.max ? 1 : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs sticky top-24">
        <FilterSidebar
          availableAirlines={availableAirlines}
          stopsOptions={stopsOptions}
          priceRange={priceRange}
          selectedStops={stopsFilter}
          selectedAirlines={airlinesFilter}
          selectedMinPrice={minPriceFilter}
          selectedMaxPrice={maxPriceFilter}
        />
      </div>

      {/* Main Results Section */}
      <div className="lg:col-span-3 space-y-4">
        {/* Partial Supplier Warnings if present */}
        <SupplierWarnings warnings={data.warnings} />

        {/* Results Controls Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
            {/* Live announcer for screen readers */}
            <div aria-live="polite" aria-atomic="true" className="text-sm font-semibold text-gray-900">
              Showing <span className="text-blue-600 font-bold">{filteredOffers.length}</span>{" "}
              {filteredOffers.length === 1 ? "flight offer" : "flight offers"}
            </div>

            {/* Mobile Filter Trigger Button */}
            <MobileFilterDialog
              availableAirlines={availableAirlines}
              stopsOptions={stopsOptions}
              priceRange={priceRange}
              selectedStops={stopsFilter}
              selectedAirlines={airlinesFilter}
              selectedMinPrice={minPriceFilter}
              selectedMaxPrice={maxPriceFilter}
              activeFiltersCount={activeFiltersCount}
            />
          </div>

          {/* Sort Dropdown */}
          <SortDropdown currentSort={sort} />
        </div>

        {/* Removable Active Filter Chips */}
        <ActiveFiltersBar
          stops={stopsFilter}
          airlines={airlinesFilter}
          minPrice={minPriceFilter}
          maxPrice={maxPriceFilter}
          availableAirlinesMap={availableAirlinesLookup}
        />

        {/* Empty or Results List */}
        {filteredOffers.length === 0 ? (
          <EmptyState activeFiltersCount={activeFiltersCount} />
        ) : (
          <FlightResultsList offers={filteredOffers} />
        )}
      </div>
    </div>
  );
}
