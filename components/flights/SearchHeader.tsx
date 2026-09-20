import React from "react";

interface SearchHeaderProps {
  origin?: string;
  destination?: string;
  date?: string;
  cabin?: string;
  totalResults?: number;
}

export function SearchHeader({
  origin = "All Origins",
  destination = "All Destinations",
  date = "15 Oct 2026",
  cabin = "Economy",
  totalResults,
}: SearchHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              ✈
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {origin} <span className="text-gray-400 font-normal">→</span> {destination}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {cabin}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                <span>📅 {date}</span>
                <span>•</span>
                <span>One-way flight search</span>
                {typeof totalResults === "number" && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-gray-700">{totalResults} offers found</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
