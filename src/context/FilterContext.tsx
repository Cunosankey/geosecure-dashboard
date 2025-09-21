// FilterContext holder styr på de valgte filtre og gør dem tilgængelige for hele appen via React Context API.
// Vi bruger en custom hook useFilters til at gøre det nemt at få adgang til filter state i komponenter
"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

// Define the shape of our filters
type Filters = {
  city: string;
  type: string;
  severity: string;
  status: string;
  source: string;
  dateFrom: string;
  dateTo: string;
};

// This type will be used for the context value to include both filters and the function to update them
// The context value is an object with filters and setFilters
type FilterContextType = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};
// Create the context with an undefined default value
// This helps in ensuring that the context is used within a provider
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Here we define the provider component that will wrap our app and provide the filter state
// We initialize the filters state with empty strings for all filter fields to represent no filters are applied when the app starts
export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<Filters>({ 
    city: "", 
    type: "", 
    severity: "", 
    status: "", 
    source: "", 
    dateFrom: "", 
    dateTo: "" 
  });

  // Memoize context value for better performance and to avoid unnecessary re-renders
  // The context value will only change if filters change
  // This is important because if we pass a new object each time, it would cause all consumers to re-render
  // even if the actual filter values didn't change
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
 
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>; // Provide the context value to children components
};

// Custom hook for easy access to the FilterContext in components like FilterPanel and MapView
// This is used to avoid importing useContext and FilterContext in every component that needs it
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
