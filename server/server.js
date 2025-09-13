import express from "express";
import cors from "cors";
import { generateIncidents } from "./utils/generateData.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API endpoint to get random incidents
app.get("/api/incidents", (req, res) => {
  const incidents = generateIncidents(10); // fx 10 incidents pr. request
  res.json(incidents);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
