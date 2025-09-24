// Here we generate mock incident data for different cities and types.
// Each incident has an id, city, type, position (longitude, latitude), color (RGB), and size (diameter), date and time.
// We simulate data for 4 cities and 4 types, resulting in 16 incidents with random sizes, dates and times.
import type { Incident as IncidentType } from "../types/incident";
export type Incident = IncidentType;

const cities: { name: string; coords: [number, number] }[] = [
  { name: "Copenhagen", coords: [12.5683, 55.6761] },
  { name: "Aarhus", coords: [10.2039, 56.1629] },
  { name: "Aalborg", coords: [9.9217, 57.0488] },
  { name: "Odense", coords: [10.3883, 55.4038] },
];

// For the colors, we use RGBA format
const types: { name: string; color: [number, number, number, number] }[] = [
  { name: "Incident", color: [255, 0, 0, 160] },   // semi-transparent rød
  { name: "Warning", color: [255, 165, 0, 160] }, // semi-transparent orange
  { name: "Alert", color: [255, 255, 0, 160] },   // semi-transparent gul
  { name: "Info", color: [0, 0, 255, 160] },      // semi-transparent blå
];

const severities = ["Low", "Medium", "High", "Critical"];
const statuses = ["Open", "Investigating", "Resolved", "Closed"];
const sources = ["Sensor", "Manual Report", "Automated System", "External Feed"];
const descriptions = [
  "Traffic disruption reported in the area.",
  "Unusual network activity detected.",
  "Weather-related warning issued.",
  "Manual report of suspicious activity.",
  "Sensor detected unusual vibration pattern.",
  "Analysis indicates a potential security threat.",
  "Potential terrorist attack suspicion reported.",
];

export function generateIncidents(): Incident[] {
  // We now generate a random diameter (in meters) for each incident plot.
  // This makes the plots much larger and more visible on the map.
  const data: Incident[] = [];
  let id = 1;
  const INCIDENTS_PER_TYPE = 6; // Number of incidents to generate per type for a more diverse mock data set
  for (const city of cities) {
    for (const t of types) {
      for (let i = 0; i < INCIDENTS_PER_TYPE; i++) {
        // Randomize position within ~0.15 degrees of city center (further spread)
      // This means incidents can appear up to ~15km away from the city center
      const [baseLon, baseLat] = city.coords;
      const randomLon = baseLon + (Math.random() - 0.5) * 0.12; // +/- 0.12 deg (longitude)
      const randomLat = baseLat + (Math.random() - 0.5) * 0.12; // +/- 0.12 deg (latitude)
      // Generate a random diameter between 250 and 450 meters for each incident
      // This makes the plots smaller and more realistic
      const diameter = Math.random() * 750 + 100;

      // Generate a random date/time in the 7 days before a fixed date(20/09/2025) (to keep data consistent)
      const fixedNow = new Date("2025-09-20T23:59:59");
      const pastWeek = new Date(fixedNow.getTime() - 7 * 24 * 60 * 60 * 1000);
      const randomTimestamp = pastWeek.getTime() + Math.random() * (fixedNow.getTime() - pastWeek.getTime());
      const randomDate = new Date(randomTimestamp);
      // Format as "HH:mm DD/MM/YYYY"
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedDate = `${pad(randomDate.getHours())}:${pad(randomDate.getMinutes())} ${pad(randomDate.getDate())}/${pad(randomDate.getMonth() + 1)}/${pad(randomDate.getFullYear())}`;
      
      data.push({
        id: id,
        incidentID: `INC-${id.toString().padStart(4, "0")}`, // e.g., INC-0001 for better realism
        city: city.name,
        type: t.name,
        position: [randomLon, randomLat],
        color: t.color,
        size: diameter,
        datetime: formattedDate,
        severity: severities[Math.floor(Math.random() * severities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
      });

      id++;
      }
      
    }
  }

  return data;
}
