"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type SearchQueryContextValue = {
  query: string;
  effectiveQuery: string;
  ready: boolean;
};

const SearchQueryContext = createContext<SearchQueryContextValue | null>(null);

export function useSearchQuery(): SearchQueryContextValue {
  const ctx = useContext(SearchQueryContext);
  if (!ctx) {
    throw new Error("useSearchQuery must be used within SearchQueryProvider");
  }
  return ctx;
}

export function SearchQueryProvider({
  query,
  effectiveQuery,
  ready,
  children,
}: SearchQueryContextValue & { children: ReactNode }) {
  const value = useMemo(
    () => ({ query, effectiveQuery, ready }),
    [query, effectiveQuery, ready],
  );

  return (
    <SearchQueryContext.Provider value={value}>
      {children}
    </SearchQueryContext.Provider>
  );
}
