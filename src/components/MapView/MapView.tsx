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
import { useSidebar } from "../../context/SidebarContext";

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

  const { sidebarOpen, setSidebarOpen } = useSidebar(); // Get sidebar state to to shift the filter panel to the right when opening the sidebar

  const { filters } = useFilters(); // Get current filters from context

// Declaration of the useState hook to render information about the plot(incidents) when hovered over with the mouse
const [hoverInfo, setHoverInfo] = React.useState<{ 
  x: number; // screen coordinates
  y: number; 
  object: Incident | null; // the incident data
} | null>(null); // We put null as initial state because nothing is hovered at the start

// Sidebar state (click on plot to open)
const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);


  // Fetch incidents from the backend API, while keeping them automatically updated when filters change.
  // We use TanStack Query's `useQuery` hook to handle data fetching, caching, and re-fetching logic.
  const { data = [] } = useQuery<Incident[]>({
    // The queryKey uniquely identifies this query in React Query’s cache.
    // Including `filters` in the key means that whenever filters change, 
    // React Query will treat it as a new query and automatically re-fetch data.
    queryKey: ["incidents", filters],
    // The queryFn defines *how* we fetch the data for this query.
    queryFn: async () => {
      // Create a query string for our API request.
      // URLSearchParams is a built-in browser API for working with query parameters (?key=value).
      const params = new URLSearchParams();
      // Loop through all key-value pairs in the filters object (city, type, severity, etc.)
      // Only include filters where the value is not empty.
      // This makes the request dynamic: only active filters are sent to the backend.
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
      // Convert our params into a proper query string (e.g., "city=Aarhus&type=Warning").
      const qs = params.toString();
      // Build the final API endpoint path.
      // If we have filters, append them as query parameters; otherwise, just call `/api/incidents`.
      const path = `/api/incidents${qs ? `?${qs}` : ""}`; // Not the path to my incidents.ts in API folder, but to the route for the Express backend
      // Perform the GET request with our helper `http` client.
      // This will return an array of incidents from the Express backend.
      return await http.get<Incident[]>(path);
    },
    // Provide placeholder data (an empty array) until the real data is fetched.
    // This avoids rendering issues with `undefined` or `null` before the fetch completes.
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
      },
      onClick: (info) => {
        if (info.object) {
          setSelectedIncident(info.object); // Open Sidebar with incident details
          setSidebarOpen(true); // Open the sidebar when an incident is clicked
        }
      }
    }),
  ];
  // Render the map using the MapLibre token and the hoverInfo for displaying incident details
  // The getCursor prop changes the cursor to a pointer when hovering over an incident, and to a grab hand when panning the map
  return (
  <>
  <div className={sidebarOpen ? styles.mapShifted : styles.mapView}> {/* We shift the map view when the sidebar is open */}
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers} getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}>
      <Map mapStyle="https://api.maptiler.com/maps/streets/style.json?key=NOe6RNQlyuLRNVci1Jv1" />
    </DeckGL>
    </div>
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
    {/* Sidebar for clicked incidents */}
{selectedIncident && (
  <div className={styles.sidebar}>
    <button
      className={styles.closeButton}
      onClick={() => {
        setSelectedIncident(null);
        setSidebarOpen(false); // This resets the filter panel position when closing the sidebar
      }}
    >
      ✕
    </button>

    <h3>{selectedIncident.type}</h3>

    <p><strong>ID:</strong> {selectedIncident.incidentID}</p>
    <p><strong>City:</strong> {selectedIncident.city}</p>
    <p><strong>Size:</strong> {Math.round(selectedIncident.size)} m</p>
    <p><strong>Date/Time:</strong> {selectedIncident.datetime}</p>
    <p><strong>Severity:</strong> {selectedIncident.severity}</p>
    <p><strong>Status:</strong> {selectedIncident.status}</p>
    <p><strong>Source:</strong> {selectedIncident.source}</p>
    <p><strong>Description:</strong> {selectedIncident.description}</p>
  </div>
)}
  </>
);
}
