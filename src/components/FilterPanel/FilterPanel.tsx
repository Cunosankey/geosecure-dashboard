"use client";

import React from "react";
import { useFilters } from "../../context/FilterContext";
import styles from "../../styles/Home.module.scss";
import { useSidebar } from "../../context/SidebarContext";

// This function renders the filter panel with dropdowns for our filters
export default function FilterPanel() {
  const { sidebarOpen } = useSidebar();
  const { filters, setFilters } = useFilters();
  const [showMore, setShowMore] = React.useState(false); // State to toggle additional filters

  return (
    <div className={`${styles.filterPanel} ${sidebarOpen ? styles.filterPanelShifted : ""}`}> {/* We add a class to shift the filter panel when the sidebar is open */}
      <label>
        City:
        <select
          value={filters.city}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}> {/* We use setFilters((prev) => ...) to ensure we keep other filter values intact */}
          {/* All is set to when the app starts so all cities and types are included, and the user can select more precise filters for specific */}
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

      {/* Toggle button for additional filters */}
      <button className={styles.moreFiltersButton} onClick={() => setShowMore((prev) => !prev)}> {/* "!prev" is used because we want to toggle the state and show more or less filters */}
        {showMore ? "Hide filters ▲" : "Show More ▼"}
      </button>
      {/* Here we put the extra filters */}
      {showMore && (
        <div className={styles.moreFilters}>
          <label>
            Severity:
            <select
              value={filters.severity} onChange={(e) => setFilters((prev) => ({ ...prev, severity: e.target.value}))}>
                <option value="">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
            </select>
          </label>

          <label>
            Status:
            <select
              value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value}))}>
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </label>

            <label>
              From:
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value}))
            } />
            </label>

            <label>
              To:
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value}))
              } />
            </label>
        </div>
      )}
    </div>
  );
}