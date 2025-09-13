// FilterContext holder styr på de valgte filtre (city, type).
"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

type Filters = {
  city: string;
  type: string;
};

type FilterContextType = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({ city: "", type: "" });

  // Memoize context value for better performance
  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
