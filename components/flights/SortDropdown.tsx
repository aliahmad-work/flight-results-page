"use client";

import React from "react";
import { useSearchFilters } from "@/lib/use-search-filters";

export type SortOption = "cheapest" | "fastest" | "earliest" | "latest";

interface SortDropdownProps {
  currentSort?: string;
}

export function SortDropdown({ currentSort = "cheapest" }: SortDropdownProps) {
  const { updateFilters } = useSearchFilters();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => updateFilters({ sort: e.target.value === "cheapest" ? null : e.target.value })}
        className="block w-full sm:w-auto rounded-lg border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-xs sm:text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs font-medium"
      >
        <option value="cheapest">Cheapest Price</option>
        <option value="fastest">Fastest Journey</option>
        <option value="earliest">Earliest Departure</option>
        <option value="latest">Latest Departure</option>
      </select>
    </div>
  );
}
