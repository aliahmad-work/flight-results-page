"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export function useSearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (updates: Record<string, string | number | string[] | null | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          current.delete(key);
        } else if (Array.isArray(value)) {
          current.set(key, value.join(","));
        } else {
          current.set(key, String(value));
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";

      startTransition(() => {
        router.push(`${pathname}${query}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Filter-specific parameters to clear
    const filterKeys = ["stops", "airlines", "minPrice", "maxPrice", "sort"];
    filterKeys.forEach((k) => current.delete(k));

    const search = current.toString();
    const query = search ? `?${search}` : "";

    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  }, [router, pathname, searchParams]);

  return {
    searchParams,
    updateFilters,
    clearFilters,
    isPending,
  };
}
