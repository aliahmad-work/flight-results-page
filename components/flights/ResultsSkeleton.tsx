import React from "react";

export function ResultsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading flight offers">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
        <div className="h-5 bg-gray-200 rounded-md w-40"></div>
        <div className="h-9 bg-gray-200 rounded-md w-36"></div>
      </div>

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="space-y-1.5">
                <div className="h-4 bg-gray-200 rounded-md w-28"></div>
                <div className="h-3 bg-gray-100 rounded-md w-20"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center py-2 max-w-lg">
              <div className="space-y-1.5">
                <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                <div className="h-3 bg-gray-100 rounded-md w-24"></div>
              </div>

              <div className="flex flex-col items-center space-y-1.5">
                <div className="h-3 bg-gray-200 rounded-md w-14"></div>
                <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                <div className="h-3 bg-gray-100 rounded-md w-16"></div>
              </div>

              <div className="space-y-1.5 text-right flex flex-col items-end">
                <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                <div className="h-3 bg-gray-100 rounded-md w-24"></div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-5 bg-gray-100 rounded-full w-20"></div>
              <div className="h-5 bg-gray-100 rounded-full w-24"></div>
            </div>
          </div>

          <div className="md:border-l md:border-gray-100 md:pl-6 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t border-gray-100 md:border-t-0">
            <div className="space-y-1 md:text-right">
              <div className="h-3 bg-gray-100 rounded-md w-16"></div>
              <div className="h-7 bg-gray-200 rounded-md w-28"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
