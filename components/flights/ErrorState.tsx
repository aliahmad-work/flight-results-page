"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  message?: string;
  statusCode?: number;
}

export function ErrorState({
  message = "Failed to load flight offers from our airline suppliers.",
  statusCode = 503,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div
      role="alert"
      className="bg-white rounded-xl border border-rose-200 p-8 sm:p-12 text-center shadow-xs"
    >
      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        ⚠️
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
        Unable to Load Flight Results
      </h2>
      <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
        {message} {statusCode ? `(Error Status: ${statusCode})` : ""}
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors shadow-xs cursor-pointer"
        >
          🔄 Retry Search
        </button>
      </div>
    </div>
  );
}
