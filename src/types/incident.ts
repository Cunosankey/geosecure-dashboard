export type Incident = {
  id: number;
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number, number]; // RGBA, so i can make it see-trough for the map
  size: number;
  datetime: string; // ISO string or formatted date/time
};
