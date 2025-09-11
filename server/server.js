import express from "express";
import cors from "cors";


const app = express();
const PORT = 5000;

// Here we use CORS to allow requests from our frontend and express.json to parse JSON bodies
app.use(cors());
app.use(express.json());

// Dummy data simulating backend incidents/alerts
const incidents = [
  { id: 1, city: "Copenhagen", type: "Incident", position: [12.5683, 55.6761], color: [255, 0, 0], size: 100 },
  { id: 2, city: "Aarhus", type: "Alert", position: [10.2039, 56.1629], color: [0, 255, 0], size: 80 },
  { id: 3, city: "Aalborg", type: "Incident", position: [9.9217, 57.0488], color: [0, 0, 255], size: 70 },
];

// API endpoint
app.get("/api/incidents", (req, res) => {
  res.json(incidents);
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
