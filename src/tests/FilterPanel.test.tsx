import { render, screen, fireEvent } from "@testing-library/react";
import { FilterProvider } from "../context/FilterContext";
import { describe, test, expect } from "vitest";
import FilterPanel from "../components/FilterPanel/FilterPanel";

// render component inside context
const renderWithContext = (ui: React.ReactNode) => {
  return render(<FilterProvider>{ui}</FilterProvider>);
};

describe("FilterPanel Component", () => {
    // Dropdowns render correctly?
  test("renders city and type dropdowns", () => {
    renderWithContext(<FilterPanel />);
    expect(screen.getByLabelText(/City:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type:/i)).toBeInTheDocument();
  });
    // Changing city updates context state?
  test("updates city filter on change", () => {
    renderWithContext(<FilterPanel />);
    const citySelect = screen.getByLabelText(/City:/i);

    fireEvent.change(citySelect, { target: { value: "Aarhus" } });
    expect(citySelect).toHaveValue("Aarhus");
  });
    // Changing type updates context state?
  test("updates type filter on change", () => {
    renderWithContext(<FilterPanel />);
    const typeSelect = screen.getByLabelText(/Type:/i);
    // Test the change event for "Incident"
    fireEvent.change(typeSelect, { target: { value: "Incident" } });
    expect(typeSelect).toHaveValue("Incident");
  });
});
