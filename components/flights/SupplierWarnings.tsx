import React from "react";
import { AirlineWarning } from "@/types/flight";

interface SupplierWarningsProps {
  warnings?: AirlineWarning[];
}

export function SupplierWarnings({ warnings }: SupplierWarningsProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div
      role="alert"
      className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 shadow-xs mb-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none text-amber-600" aria-hidden="true">
          ⚠️
        </span>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-amber-950">
            Partial Flight Inventory Notice
          </h2>
          <p className="text-xs text-amber-800">
            Some airline partners were temporarily unavailable during this search. Available offers from responsive carriers are displayed below:
          </p>
          <ul className="list-disc list-inside text-xs text-amber-900 mt-1 space-y-0.5">
            {warnings.map((w, idx) => (
              <li key={idx}>
                <strong>{w.airline} ({w.airlineCode})</strong>: {w.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
