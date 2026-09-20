"use client";

import React from "react";
import { useSearchFilters } from "@/lib/use-search-filters";
import { formatCurrency } from "@/lib/formatters";

interface ActiveFiltersBarProps {
  stops?: string[];
  airlines?: string[];
  minPrice?: number;
  maxPrice?: number;
  availableAirlinesMap?: Record<string, string>; // code -> name
}

export function ActiveFiltersBar({
  stops = [],
  airlines = [],
  minPrice,
  maxPrice,
  availableAirlinesMap = {},
}: ActiveFiltersBarProps) {
  const { updateFilters, clearFilters } = useSearchFilters();

  const hasActiveFilters =
    stops.length > 0 ||
    airlines.length > 0 ||
    typeof minPrice === "number" ||
    typeof maxPrice === "number";

  if (!hasActiveFilters) return null;

  const removeStop = (stopVal: string) => {
    const next = stops.filter((s) => s !== stopVal);
    updateFilters({ stops: next.length > 0 ? next : null });
  };

  const removeAirline = (code: string) => {
    const next = airlines.filter((a) => a !== code);
    updateFilters({ airlines: next.length > 0 ? next : null });
  };

  const removePriceFilter = () => {
    updateFilters({ minPrice: null, maxPrice: null });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap py-2 border-b border-gray-100 mb-4" aria-label="Active filters">
      <span className="text-xs font-semibold text-gray-500">Active Filters:</span>

      {/* Stops chips */}
      {stops.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => removeStop(s)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
          aria-label={`Remove filter for ${s === "0" ? "Non-stop" : `${s} Stop(s)`}`}
        >
          <span>{s === "0" ? "Non-stop" : `${s} Stop(s)`}</span>
          <span className="text-blue-500 font-bold" aria-hidden="true">×</span>
        </button>
      ))}

      {/* Airlines chips */}
      {airlines.map((code) => {
        const name = availableAirlinesMap[code] || code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => removeAirline(code)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer"
            aria-label={`Remove filter for ${name}`}
          >
            <span>{name}</span>
            <span className="text-indigo-500 font-bold" aria-hidden="true">×</span>
          </button>
        );
      })}

      {/* Price chip */}
      {(typeof minPrice === "number" || typeof maxPrice === "number") && (
        <button
          type="button"
          onClick={removePriceFilter}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
          aria-label="Remove price filter"
        >
          <span>
            Price: {minPrice ? formatCurrency(minPrice) : "0"} - {maxPrice ? formatCurrency(maxPrice) : "Max"}
          </span>
          <span className="text-emerald-500 font-bold" aria-hidden="true">×</span>
        </button>
      )}

      {/* Clear All button */}
      <button
        type="button"
        onClick={clearFilters}
        className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline ml-1 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
}
