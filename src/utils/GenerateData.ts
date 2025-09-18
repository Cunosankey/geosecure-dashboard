// Here we generate mock incident data for different cities and types.
// Each incident has an id, city, type, position (longitude, latitude), color (RGB), and size (radius).
// We simulate data for 4 cities and 4 types, resulting in 16 incidents with random sizes.
export type Incident = {
  id: number;
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number, number]; // RGBA, so i can make it see-trough for the map
  size: number;
};

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

export function generateIncidents(): Incident[] {
  const data: Incident[] = [];
  let id = 1;
  for (const city of cities) {
    for (const t of types) {
      // Randomize position within ~0.02 degrees of city center
      const [baseLon, baseLat] = city.coords;
      const randomLon = baseLon + (Math.random() - 0.5) * 0.04; // +/- 0.02 deg
      const randomLat = baseLat + (Math.random() - 0.5) * 0.04; // +/- 0.02 deg
      data.push({
        id: id++,
        city: city.name,
        type: t.name,
        position: [randomLon, randomLat],
        color: t.color,
        size: Math.floor(Math.random() * 350) + 120, // Random size between 120 and 470
      });
    }
  }
  return data;
}
