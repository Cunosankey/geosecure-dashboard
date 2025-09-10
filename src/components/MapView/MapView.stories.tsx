import MapView from "./MapView";
import { FilterProvider } from "../../context/FilterContext";

export default {
  title: "Components/MapView",
  component: MapView,
};

export const Default = () => (
  <FilterProvider>
    <MapView />
  </FilterProvider>
);