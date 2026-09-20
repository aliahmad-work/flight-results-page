import React from "react";
import { SearchHeader } from "@/components/flights/SearchHeader";
import { SimulationBar } from "@/components/flights/SimulationBar";
import { ResultsSkeleton } from "@/components/flights/ResultsSkeleton";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <SimulationBar />
      <SearchHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ResultsSkeleton />
      </main>
    </div>
  );
}
