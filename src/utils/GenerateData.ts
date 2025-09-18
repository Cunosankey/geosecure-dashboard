// Here we generate mock incident data for different cities and types.
// Each incident has an id, city, type, position (longitude, latitude), color (RGB), and size (radius).
// We simulate data for 4 cities and 4 types, resulting in 16 incidents with random sizes.
export type Incident = {
  id: number;
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number];
  size: number;
};

const cities: { name: string; coords: [number, number] }[] = [
  { name: "Copenhagen", coords: [12.5683, 55.6761] },
  { name: "Aarhus", coords: [10.2039, 56.1629] },
  { name: "Aalborg", coords: [9.9217, 57.0488] },
  { name: "Odense", coords: [10.3883, 55.4038] },
];

const types: { name: string; color: [number, number, number] }[] =[
  // For the colors, we use RGB format
  { name: "Incident", color: [255, 0, 0] }, // red
  { name: "Warning", color: [255, 165, 0] }, // orange
  { name: "Alert", color: [0, 255, 0] }, // green
  { name: "Info", color: [0, 0, 255] }, // blue
];

export function generateIncidents(): Incident[] {
  const data: Incident[] = [];
  let id = 1;
  for (const city of cities) {
    for (const t of types) {
      data.push({
        id: id++,
        city: city.name,
        type: t.name,
        position: city.coords,
        color: t.color,
        size: Math.floor(Math.random() * 40) + 60,
      });
    }
  }
  return data;
}
