import React, { Suspense } from "react";
import { SearchHeader } from "@/components/flights/SearchHeader";
import { SimulationBar } from "@/components/flights/SimulationBar";
import { ResultsSkeleton } from "@/components/flights/ResultsSkeleton";
import { FlightResultsContainer } from "@/components/flights/FlightResultsContainer";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FlightSearchPage({ searchParams }: SearchPageProps) {
  // In Next.js 15+, searchParams is a Promise
  const resolvedParams = await searchParams;

  const origin = typeof resolvedParams.origin === "string" ? resolvedParams.origin.toUpperCase() : "Pakistan (Any)";
  const destination = typeof resolvedParams.destination === "string" ? resolvedParams.destination.toUpperCase() : "All Destinations";
  const date = typeof resolvedParams.date === "string" ? resolvedParams.date : "15 Oct 2026";
  const cabin = typeof resolvedParams.cabin === "string" ? resolvedParams.cabin : "Economy";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Quick simulation toolbar */}
      <Suspense fallback={<div className="bg-slate-900 h-8 w-full"></div>}>
        <SimulationBar />
      </Suspense>

      {/* 2. Top Route Search Context Header */}
      <SearchHeader
        origin={origin}
        destination={destination}
        date={date}
        cabin={cabin}
      />

      {/* 3. Main Search Results & Filters Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense
          key={JSON.stringify(resolvedParams)}
          fallback={<ResultsSkeleton />}
        >
          <FlightResultsContainer searchParams={resolvedParams} />
        </Suspense>
      </main>
    </div>
  );
}
