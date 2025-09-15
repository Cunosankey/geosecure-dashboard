// This is my main Express server. It sets up the app, middleware, and starts listening for requests.
// It serves incident data at the /api/incidents endpoint.

const express = require("express");
const cors = require("cors");
const incidentsRoute = require("../routes/incidents"); // here we use the incidents route from routes/incidents.js to handle /api/incidents requests

// create the express app
const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// Here we set up middleware and routes
app.use(cors());
app.use(express.json());

// Here we define the /api/incidents route
app.use("/api/incidents", incidentsRoute);

// And lastly we start the server with the listen method and log the URL
app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});

// To run the server, use the command: nodemon server/server.js