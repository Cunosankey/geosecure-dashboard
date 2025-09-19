"use client";

import React from "react";
import { useFilters } from "../../context/FilterContext";
import styles from "../../styles/Home.module.scss";

export default function FilterPanel() {
  const { filters, setFilters } = useFilters();

  return (
    <div className={styles.filterPanel}>
      <label>
        City:
        <select
          value={filters.city}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))} // We use setFilters((prev) => ...) to ensure we keep other filter values intact
        >
          <option value="">All</option>
          <option value="Copenhagen">Copenhagen</option>
          <option value="Aarhus">Aarhus</option>
          <option value="Aalborg">Aalborg</option>
          <option value="Odense">Odense</option>
        </select>
      </label>

      <label>
        Type:
        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="">All</option>
          <option value="Warning">Warning</option>
          <option value="Alert">Alert</option>
          <option value="Incident">Incident</option>
          <option value="Info">Info</option>
        </select>
      </label>
    </div>
  );
}