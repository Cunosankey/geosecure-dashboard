"use client";

import React, { useMemo } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useFilters } from "../../context/FilterContext";
import FilterPanel from "../FilterPanel/FilterPanel";

// Sample data points
const DATA = [
  { position: [12.5683, 55.6761], size: 100, color: [255, 0, 0], city: "Copenhagen", type: "Incident" },
  { position: [10.2039, 56.1629], size: 80, color: [0, 255, 0], city: "Aarhus", type: "Alert" },
  { position: [9.9217, 57.0488], size: 70, color: [0, 0, 255], city: "Aalborg", type: "Incident" },
];

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

  // Memoize filtered data for performance to avoid unnecessary recalculations
  const filteredData = useMemo(() => {
    return DATA.filter((item) => {
      const cityMatch = !filters.city || item.city === filters.city;
      const typeMatch = !filters.type || item.type === filters.type;
      return cityMatch && typeMatch;
    });
  }, [filters]);
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
  // Render the map
  return (
    <>
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
        <Map mapStyle="https://api.maptiler.com/maps/streets/style.json?key=NOe6RNQlyuLRNVci1Jv1" />
      </DeckGL>
    </>
  );
}
