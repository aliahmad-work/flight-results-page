"use client";

import React, { useId } from "react";
import { useSearchFilters } from "@/lib/use-search-filters";
import { formatCurrency } from "@/lib/formatters";

export interface AvailableFilterOption {
  code: string;
  name: string;
  minPrice?: number;
  count: number;
}

interface FilterSidebarProps {
  availableAirlines: AvailableFilterOption[];
  stopsOptions: { stops: number; label: string; minPrice?: number; count: number }[];
  priceRange: { min: number; max: number };
  selectedStops?: string[];
  selectedAirlines?: string[];
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  availableAirlines,
  stopsOptions,
  priceRange,
  selectedStops = [],
  selectedAirlines = [],
  selectedMinPrice,
  selectedMaxPrice,
  onCloseMobile,
}: FilterSidebarProps) {
  const { updateFilters, clearFilters } = useSearchFilters();
  const maxPriceInputId = useId();

  const handleStopToggle = (stopVal: string) => {
    const next = selectedStops.includes(stopVal)
      ? selectedStops.filter((s) => s !== stopVal)
      : [...selectedStops, stopVal];
    updateFilters({ stops: next.length > 0 ? next : null });
  };

  const handleAirlineToggle = (airlineCode: string) => {
    const next = selectedAirlines.includes(airlineCode)
      ? selectedAirlines.filter((a) => a !== airlineCode)
      : [...selectedAirlines, airlineCode];
    updateFilters({ airlines: next.length > 0 ? next : null });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= priceRange.max) {
      updateFilters({ maxPrice: null });
    } else {
      updateFilters({ maxPrice: val });
    }
  };

  const currentMaxPrice = typeof selectedMaxPrice === "number" ? selectedMaxPrice : priceRange.max;
  const hasFiltersApplied =
    selectedStops.length > 0 ||
    selectedAirlines.length > 0 ||
    typeof selectedMinPrice === "number" ||
    (typeof selectedMaxPrice === "number" && selectedMaxPrice < priceRange.max);

  return (
    <aside className="w-full min-w-0 space-y-6" aria-label="Flight search filters">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">Filters</h2>
        {hasFiltersApplied && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            Reset all
          </button>
        )}
      </div>

      {/* 1. Stops Filter */}
      <fieldset className="min-w-0 w-full space-y-3">
        <legend className="text-sm font-semibold text-gray-900 mb-2">
          Stops
        </legend>
        <div className="space-y-2">
          {stopsOptions.map((opt) => {
            const valStr = String(opt.stops);
            const isChecked = selectedStops.includes(valStr);
            const inputId = `stop-${opt.stops}`;
            return (
              <label
                key={opt.stops}
                htmlFor={inputId}
                className="flex items-center justify-between gap-2 w-full text-xs sm:text-sm text-gray-700 cursor-pointer hover:text-gray-900 py-1"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    id={inputId}
                    checked={isChecked}
                    onChange={() => handleStopToggle(valStr)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <span className="truncate">{opt.label}</span>
                </div>
                <span className="text-xs text-gray-400 font-mono shrink-0 ml-auto pl-2 text-right whitespace-nowrap">
                  {opt.minPrice ? `from ${formatCurrency(opt.minPrice)}` : `(${opt.count})`}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 2. Airlines Filter */}
      <fieldset className="min-w-0 w-full space-y-3 pt-4 border-t border-gray-100">
        <legend className="text-sm font-semibold text-gray-900 mb-2">
          Airlines
        </legend>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {availableAirlines.map((airline) => {
            const isChecked = selectedAirlines.includes(airline.code);
            const inputId = `airline-${airline.code}`;
            return (
              <label
                key={airline.code}
                htmlFor={inputId}
                className="flex items-center justify-between gap-2 w-full text-xs sm:text-sm text-gray-700 cursor-pointer hover:text-gray-900 py-1"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    id={inputId}
                    checked={isChecked}
                    onChange={() => handleAirlineToggle(airline.code)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                  />
                  <span className="truncate" title={airline.name}>{airline.name}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0 font-mono ml-auto pl-2 text-right whitespace-nowrap">
                  {airline.minPrice ? formatCurrency(airline.minPrice) : `(${airline.count})`}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 3. Max Price Filter */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <label htmlFor={maxPriceInputId} className="text-sm font-semibold text-gray-900">
            Max Price
          </label>
          <span className="text-xs font-bold text-blue-600 font-mono">
            {formatCurrency(currentMaxPrice)}
          </span>
        </div>
        <input
          type="range"
          id={maxPriceInputId}
          min={priceRange.min}
          max={priceRange.max}
          step={1000}
          value={currentMaxPrice}
          onChange={handleMaxPriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          aria-valuemin={priceRange.min}
          aria-valuemax={priceRange.max}
          aria-valuenow={currentMaxPrice}
        />
        <div className="flex justify-between text-[11px] text-gray-400 font-mono">
          <span>{formatCurrency(priceRange.min)}</span>
          <span>{formatCurrency(priceRange.max)}</span>
        </div>
      </div>

      {/* Close button for mobile dialog */}
      {onCloseMobile && (
        <div className="pt-4 border-t border-gray-200 block lg:hidden">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"
          >
            Apply & View Results
          </button>
        </div>
      )}
    </aside>
  );
}
