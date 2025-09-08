"use client";

import React from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";

const DATA = [
  { position: [12.5683, 55.6761], size: 100, color: [255, 0, 0] }, // København
  { position: [10.2039, 56.1629], size: 80, color: [0, 255, 0] },  // Aarhus
];

const INITIAL_VIEW_STATE = {
  longitude: 12.5683,
  latitude: 55.6761,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

export default function MapView() {
  const layers = [
    new ScatterplotLayer({
      id: "scatter",
      data: DATA,
      getPosition: (d: any) => d.position,
      getFillColor: (d: any) => d.color,
      getRadius: (d: any) => d.size,
    }),
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
      <StaticMap mapboxApiAccessToken="DIN_MAPBOX_API_KEY" />
    </DeckGL>
  );
}
