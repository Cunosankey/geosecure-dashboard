// Here we define the /api/incidents route and handles requests, including filtering and returning mock data.
// We simulate some data and allow filtering via query parameters.

import express from "express";
import { generateIncidents } from "../src/utils/GenerateData";
import type { Incident } from "../src/utils/GenerateData";

const router = express.Router();

function parseIncidentDate(dateStr: string): Date {
  // Expects "HH:mm DD/MM/YYYY"
  // trying to fix date filtering
  const [time, date] = dateStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  const [day, month, year] = date.split("/").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

// New helper to parse "YYYY-MM-DD" dates from filter query params and see if this fixes it
function parseFilterDate(dateStr: string): Date {
  // Expects "YYYY-MM-DD"
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function toDateString(date: Date): string {
  // Always returns YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}



/**
 * Helper function that applies all query filters to the incidents.
 * Instead of writing a long list of "if" statements, we:
 *  - Loop through all filters dynamically (from req.query)
 *  - Use a switch to handle different filter keys
 *  - Return only the incidents that pass all conditions
 */
const applyFilters = (incidents: Incident[], filters: Record<string, string | undefined>): Incident[] => {
  return incidents.filter((incident) => {
    const incidentDate = toDateString(parseIncidentDate(incident.datetime));
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      switch (key) {
        case "city":
        case "type":
        case "severity":
        case "status":
        case "source":
          if (
            typeof incident[key] !== "string" ||
            incident[key].toLowerCase() !== value.toLowerCase()
          ) {
            return false;
          }
          break;
        case "dateFrom":
          if (incidentDate < value) return false;
          break;
        case "dateTo":
          if (incidentDate > value) return false;
          break;
      }
    }
    return true;
  });
};

// GET api/incidents
router.get("/", (req, res) => {
  try {
    const filters = req.query as Record<string, string | undefined>;
    let incidents: Incident[] = generateIncidents();
    incidents = applyFilters(incidents, filters);
    res.json(incidents);
  } catch (err) {
    console.error("Error in /api/incidents:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
