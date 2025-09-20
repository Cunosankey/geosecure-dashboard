// MapView henter alle incidents (fra mit mock-API eller et statisk array).
// MapView filtrerer data vha. useMemo baseret på filters.
// DeckGL ScatterplotLayer viser de filtrerede punkter på kortet.
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useFilters } from "../../context/FilterContext";
import type { Incident } from "../../types/incident";
import styles from "../../styles/Home.module.scss";
import { http } from "../../api/http";


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

// Declaration of the useState hook to render information about the plot(incidents) when hovered over with the mouse
const [hoverInfo, setHoverInfo] = React.useState<{ 
  x: number; // screen coordinates
  y: number; 
  object: Incident | null; // the incident data
} | null>(null); // We put null as initial state because nothing is hovered at the start


  // Use TanStack Query for incidents fetching
  const {
    data = [] as Incident[],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Incident[]>({
    queryKey: ["incidents", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.city) params.set("city", filters.city);
      if (filters.type) params.set("type", filters.type);
      const qs = params.toString();
      const path = `/api/incidents${qs ? `?${qs}` : ""}`;
      return await http.get<Incident[]>(path);
    },
    placeholderData: [],
  });
  
  // Define layers for DeckGL, because layers depend on filteredData, they will update when filters change
  const layers = [
    new ScatterplotLayer({
      id: "scatter",
      data, // Use the filtered data
      pickable: true, 
      getPosition: (d: any) => d.position,
      getFillColor: (d: any) => d.color,
      getRadius: (d: any) => d.size,
      radiusUnits: "meters",
      stroked: true,      // Enable borders around circles
      getLineColor: [0, 0, 0, 255],   // Black border for better visibility
      lineWidthMaxPixels: 1.5,    // Thicker border for better visibility
      onHover: (info) => {
        if (info.object) {
          setHoverInfo({ x: info.x, y: info.y, object: info.object });
        } else {
          setHoverInfo(null);
        }
      }
    }),
  ];
  // Render the map using the MapLibre token and the hoverInfo for displaying incident details
  // The getCursor prop changes the cursor to a pointer when hovering over an incident, and to a grab hand when panning the map
  return (
  <>
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers} getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}>
      <Map mapStyle="https://api.maptiler.com/maps/streets/style.json?key=NOe6RNQlyuLRNVci1Jv1" />
    </DeckGL>
    {hoverInfo && hoverInfo.object && (
      <div className={styles.hoverTooltip} style={{ // This is for displaying a dialogue box when hovering over an incident
        position: 'absolute', // Ensure the tooltip is positioned absolutely
        left: hoverInfo.x + 11, //Position the tooltip a little to the right and down from the cursor
        top: hoverInfo.y + 11, 
        pointerEvents: 'none', // Ensure the tooltip doesn't interfere with mouse events
        zIndex: 10, // Make sure tooltip is on top
      }}>
        <strong>{hoverInfo.object.type}</strong><br />
        City: {hoverInfo.object.city}<br />
        Size: {Math.round(hoverInfo.object.size)} m<br />
        Date/Time: {hoverInfo.object.datetime}
      </div>
    )}
    {hoverInfo?.object && console.log(hoverInfo.object)}
  </>
);
}
