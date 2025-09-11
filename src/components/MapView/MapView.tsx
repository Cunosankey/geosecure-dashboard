"use client";

import React, { useMemo, useEffect } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useFilters } from "../../context/FilterContext";

// Define the Incident type
type Incident = {
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number];
  size: number;
};

// Main MapView component. Here we integrate the map with filtering functionality.
export default function MapView() {
  const { filters } = useFilters();

  // Local state for incidents fetched from backend
  const [data, setData] = React.useState<Incident[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/incidents")
      .then((res) => res.json())
      .then((incoming) => setData(incoming))
      .catch((err) => {
        console.error("Failed to fetch incidents:", err);
      });
  }, []);

// Initial view state for the map
const INITIAL_VIEW_STATE = {
  longitude: 12.5683,
  latitude: 55.6761,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

  // Memoize filtered data for performance to avoid unnecessary recalculations
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const cityMatch = !filters.city || item.city === filters.city;
      const typeMatch = !filters.type || item.type === filters.type;
      return cityMatch && typeMatch;
    });
  }, [filters, data]);
  // Define layers for DeckGL, because layers depend on filteredData, they will update when filters change
  const layers = [
    new ScatterplotLayer({
      id: "scatter",
      data: filteredData,
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
