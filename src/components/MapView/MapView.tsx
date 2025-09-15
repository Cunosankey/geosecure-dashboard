// MapView henter alle incidents (fra mit mock-API eller et statisk array).
// MapView filtrerer data vha. useMemo baseret på filters.
// DeckGL ScatterplotLayer viser de filtrerede punkter på kortet.
"use client";

import React, { useMemo, useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useFilters } from "../../context/FilterContext";

// Define the Incident type 
type Incident = {
  id: number;
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number];
  size: number;
};

// Initial view state for the map
const INITIAL_VIEW_STATE = {
  longitude: 12.5683,
  latitude: 55.6761,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

// Main MapView component. Here we integrate the map with filtering functionality.
export default function MapView() {
  const { filters } = useFilters();
  // Local state for incidents fetched from backend
  const [data, setData] = React.useState<Incident[]>([]);

  // Fetch data when filters change. We use useEffect to trigger fetch on filter change and on every render (can be made more optimized later)
  useEffect(() => {
    const q = new URLSearchParams();
    if (filters.city) q.set("city", filters.city); // only add to query if filter is set
    if (filters.type) q.set("type", filters.type); 

    fetch(`http://localhost:5000/api/incidents?${q.toString()}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Failed to fetch incidents:", err);
        setData([]); // fallback hvis API fejler
      });
  }, [filters]); // <-- nyt fetch når filters ændres
  
  // Define layers for DeckGL, because layers depend on filteredData, they will update when filters change
  const layers = [
    new ScatterplotLayer({
      id: "scatter",
      data,
      getPosition: (d: any) => d.position,
      getFillColor: (d: any) => d.color,
      getRadius: (d: any) => d.size,
    }),
  ];
  // Render the map using the MapLibre token
  return (
    <>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
        <Map mapStyle="https://api.maptiler.com/maps/streets/style.json?key=NOe6RNQlyuLRNVci1Jv1" />
      </DeckGL>
    </>
  );
}
