// Here we define the /api/incidents route and handles requests, including filtering and returning mock data.
// We simulate some data and allow filtering via query parameters.

const express = require("express");
const router = express.Router();

// Dummy data simulating backend incidents/alerts
const incidents = [
  { id: 1, city: "Copenhagen", type: "Incident", position: [12.5683, 55.6761], color: [255, 0, 0], size: 1100 },
  { id: 2, city: "Aarhus", type: "Alert", position: [10.2039, 56.1629], color: [0, 255, 0], size: 760 },
  { id: 3, city: "Aalborg", type: "Warning", position: [9.9217, 57.0488], color: [0, 0, 255], size: 910 },
  { id: 4, city: "Odense", type: "Info", position: [10.3951, 55.4038], color: [255, 255, 0], size: 640 },
];

// GET all incidents with optional filtering by city and type
router.get("/", (req, res) => {
  const { city, type } = req.query; // læs query params fra URL'en

  let filtered = incidents;

  if (city) { // vi bruger toLowerCase, fordi vi vil være case-insensitive, hvilket self betyder at "copenhagen" og "Copenhagen" behandles ens
    filtered = filtered.filter((item) => item.city.toLowerCase() === city.toLowerCase()); 
  }

  if (type) {
    filtered = filtered.filter((item) => item.type.toLowerCase() === type.toLowerCase());
  }

  res.json(filtered);
});

module.exports = router;
