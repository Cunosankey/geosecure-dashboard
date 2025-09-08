import MapView from "../components/MapView/MapView";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import styles from "../styles/Home.module.scss";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1>GeoSecure Dashboard</h1>
      <FilterPanel />
      <MapView />
    </main>
  );
}
