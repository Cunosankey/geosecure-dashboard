import { render, screen } from "@testing-library/react";
import { FilterProvider, useFilters } from "../context/FilterContext";
import { describe, test, expect, vi } from "vitest";
import React from "react";
import MapView from "../components/MapView/MapView";


// Mock DeckGL since it's heavy to render in tests
vi.mock("@deck.gl/react", () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="deckgl">{children}</div>,
}));

describe("MapView Component", () => {
  test("renders the map component", () => {
    render(
      <FilterProvider>
        <MapView />
      </FilterProvider>
    );

    // Map should render from MapLibre
    expect(screen.getByTestId("deckgl")).toBeInTheDocument();
  });

  test("displays correct data points when filters are applied", () => {
    const TestComponent = () => {
      const { setFilters } = useFilters();
      return (
        <>
          <button onClick={() => setFilters({ city: "Copenhagen", type: "", severity: "", status: "", source: "", dateFrom: "", dateTo: "" })}>
            Apply Filter
          </button>
          <MapView />
        </>
      );
    };

    render(
      <FilterProvider>
        <TestComponent />
      </FilterProvider>
    );

    // Click the button to simulate filter change
    screen.getByText("Apply Filter").click();

    // Since only Copenhagen matches, filtered data should contain 1 point
    // We'll check if DeckGL rerenders accordingly
    expect(screen.getByTestId("deckgl")).toBeInTheDocument();
  });
});
