"use client";

import MapView from "../components/MapView/MapView";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import styles from "../styles/Home.module.scss";

export default function Page() {
  return (
    <div className={styles.pageWrapper}>
      <FilterPanel />
      <div className={styles.mapContainer}>
        <MapView />
      </div>
    </div>
  );
}
