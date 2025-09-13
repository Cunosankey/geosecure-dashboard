// utils/generateData.ts
type Incident = {
  id: number;
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number];
  size: number;
};

const cities: { name: string; position: [number, number] }[] = [
  { name: "Copenhagen", position: [12.5683, 55.6761] },
  { name: "Aarhus", position: [10.2039, 56.1629] },
  { name: "Aalborg", position: [9.9217, 57.0488] },
  { name: "Odense", position: [10.3883, 55.4038] },
];

const types: { type: string; color: [number, number, number] }[] = [
  { type: "Incident", color: [255, 0, 0] },
  { type: "Alert", color: [0, 255, 0] },
  { type: "Warning", color: [255, 165, 0] },
  { type: "Info", color: [0, 0, 255] },
];

export function generateIncidents(count: number): Incident[] {
  const incidents: Incident[] = [];

  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const typeObj = types[Math.floor(Math.random() * types.length)];

    incidents.push({
      id: i + 1,
      city: city.name,
      type: typeObj.type,
      position: city.position,
      color: typeObj.color,
      size: Math.floor(Math.random() * 100) + 20, // random size 20–120
    });
  }

  return incidents;
}
