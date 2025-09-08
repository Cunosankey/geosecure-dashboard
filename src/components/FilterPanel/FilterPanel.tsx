"use client";

import React, { useState } from "react";
import styles from "../../styles/Home.module.scss";

export default function FilterPanel() {
  const [filters, setFilters] = useState({ city: "", type: "" });

  return (
    <div className={styles.filters}>
      <label>
        City:
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          <option value="">All</option>
          <option value="Copenhagen">Copenhagen</option>
          <option value="Aarhus">Aarhus</option>
        </select>
      </label>
    </div>
  );
}