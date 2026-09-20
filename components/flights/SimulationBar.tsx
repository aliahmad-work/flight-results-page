"use client";

import React from "react";
import { useSearchFilters } from "@/lib/use-search-filters";
import { SimulationMode } from "@/types/flight";

const MODES: { id: SimulationMode; label: string; description: string; badgeColor: string }[] = [
  { id: "ok", label: "OK (Default)", description: "Normal offers response", badgeColor: "bg-emerald-100 text-emerald-800" },
  { id: "slow", label: "Slow", description: "2.5s delayed response", badgeColor: "bg-amber-100 text-amber-800" },
  { id: "error", label: "Error (503)", description: "Supplier timeout error", badgeColor: "bg-rose-100 text-rose-800" },
  { id: "empty", label: "Empty (0)", description: "Zero flight results", badgeColor: "bg-gray-100 text-gray-800" },
  { id: "partial", label: "Partial", description: "Partial feeds with warnings", badgeColor: "bg-purple-100 text-purple-800" },
];

export function SimulationBar() {
  const { searchParams, updateFilters, isPending } = useSearchFilters();
  const currentMode = (searchParams.get("simulate") || "ok") as SimulationMode;

  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">⚡ API Simulation:</span>
          <span className="text-slate-400 hidden sm:inline">Test take-home scenarios</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="API Simulation Modes">
          {MODES.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => updateFilters({ simulate: m.id === "ok" ? null : m.id })}
                disabled={isPending}
                className={`px-2.5 py-1 rounded-md font-medium transition-all text-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                title={m.description}
                aria-pressed={isActive}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
