"use client";

import React from "react";
import { useSearchFilters } from "@/lib/use-search-filters";

interface EmptyStateProps {
  activeFiltersCount?: number;
}

export function EmptyState({ activeFiltersCount = 0 }: EmptyStateProps) {
  const { clearFilters } = useSearchFilters();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs">
      <div className="w-14 h-14 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        🔍
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
        No Flights Found
      </h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        {activeFiltersCount > 0
          ? "No flight offers match your current filter selection. Try adjusting or clearing your filters to see more results."
          : "There are currently no flights available for this route or query."}
      </p>
      {activeFiltersCount > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 active:bg-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors shadow-xs cursor-pointer"
          >
            Clear Active Filters
          </button>
        </div>
      )}
    </div>
  );
}
