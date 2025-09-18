// This is my main Express server. It sets up the app, middleware, and starts listening for requests.
// It serves incident data at the /api/incidents endpoint.

import express from "express";
import cors from "cors";
import incidentsRoute from "../routes/incidents"; // use .ts extension if needed: "../routes/incidents.ts"

// create the express app
const app = express();
const PORT = process.env.PORT || 5000;

// Here we set up middleware and routes
app.use(cors());
app.use(express.json());

// Here we define the /api/incidents route
app.use("/api/incidents", incidentsRoute);

// And lastly we start the server with the listen method and log the URL
app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});

// To run the server, use the command: npx ts-node server/server.ts