import FilterPanel from "./FilterPanel";
import { FilterProvider } from "../../context/FilterContext";

export default {
  title: "Components/FilterPanel",
  component: FilterPanel,
};

export const Default = () => (
  <FilterProvider>
    <FilterPanel />
  </FilterProvider>
);