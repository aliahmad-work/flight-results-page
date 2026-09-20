"use client";

import React, { useState, useEffect, useRef } from "react";
import { FilterSidebar, AvailableFilterOption } from "./FilterSidebar";

interface MobileFilterDialogProps {
  availableAirlines: AvailableFilterOption[];
  stopsOptions: { stops: number; label: string; minPrice?: number; count: number }[];
  priceRange: { min: number; max: number };
  selectedStops?: string[];
  selectedAirlines?: string[];
  selectedMinPrice?: number;
  selectedMaxPrice?: number;
  activeFiltersCount?: number;
}

export function MobileFilterDialog({
  availableAirlines,
  stopsOptions,
  priceRange,
  selectedStops = [],
  selectedAirlines = [],
  selectedMinPrice,
  selectedMaxPrice,
  activeFiltersCount = 0,
}: MobileFilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Focus trapping and Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Auto-focus first focusable item in dialog
    const timer = setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="lg:hidden">
      {/* Mobile trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span>⚙ Filters</span>
        {activeFiltersCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Accessible Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Filter flight offers"
        >
          <div
            ref={dialogRef}
            className="bg-white w-full sm:max-w-md max-h-[90vh] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filter Flights</h3>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-lg font-bold cursor-pointer"
                aria-label="Close filters dialog"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 pb-4">
              <FilterSidebar
                availableAirlines={availableAirlines}
                stopsOptions={stopsOptions}
                priceRange={priceRange}
                selectedStops={selectedStops}
                selectedAirlines={selectedAirlines}
                selectedMinPrice={selectedMinPrice}
                selectedMaxPrice={selectedMaxPrice}
                onCloseMobile={handleClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
