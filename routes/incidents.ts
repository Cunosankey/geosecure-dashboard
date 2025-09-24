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
    // Loop through each filter key-value pair and check if the incident matches
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue; // Skip empty filters
      /**
       * We use a switch here because:
       *  - Some filters (city, type, severity, status, source) all use the same case-insensitive string equality check.
       *  - Other filters (dateFrom, dateTo) need special handling since they involve comparing Date objects.
       *  - Using switch makes the logic clear, centralized, and easy to extend later if we add new filter types.
       */
      switch (key) {
        case "city":
        case "type":
        case "severity":
        case "status":
        case "source":
          // Only filter if the incident has that key and it matches (case-insensitive)
          if (
            typeof incident[key] !== "string" || 
            incident[key].toLowerCase() !== value.toLowerCase()
          ) {
            return false;
          }
          break;

        case "dateFrom": {
          const from = toDateString(parseFilterDate(value)); 
          const incidentDate = toDateString(parseIncidentDate(incident.datetime));
          console.log("Comparing incidentDate", incidentDate, "with from", from);
          if (incidentDate < from) return false;
          break;
        }

        case "dateTo": {
          const to = toDateString(parseFilterDate(value)); 
          const incidentDate = toDateString(parseIncidentDate(incident.datetime));
          console.log("Comparing incidentDate", incidentDate, "with to", to);
          if (incidentDate > to) return false;
          break;
        }

        default: 
        break; // Ignore unknown filters
  }
    return true; // Keep the incident if all filters match
  }});
};


// GET api/incidents
router.get("/", (req, res) => {

  // Grab all query parameters as filters
  const filters = req.query as Record<string, string | undefined>;
  // Generate all mock data
  let incidents: Incident[] = generateIncidents();

  // Apply filters in one place
  incidents = applyFilters(incidents, filters);

  res.json(incidents);
});

export default router;
