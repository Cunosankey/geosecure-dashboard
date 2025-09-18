// Here we define the /api/incidents route and handles requests, including filtering and returning mock data.
// We simulate some data and allow filtering via query parameters.

import express from "express";
import { generateIncidents } from "../src/utils/GenerateData";
import type { Incident } from "../src/utils/GenerateData";

const router = express.Router();

// GET all incidents with optional filtering by city and type
router.get("/", (req, res) => {
  const { city, type } = req.query as { city?: string; type?: string };
  let incidents: Incident[] = generateIncidents();

  if (city) {
    incidents = incidents.filter((item) => item.city.toLowerCase() === city.toLowerCase());
  }
  if (type) {
    incidents = incidents.filter((item) => item.type.toLowerCase() === type.toLowerCase());
  }
  res.json(incidents);
});

export default router;
