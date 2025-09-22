export type Incident = {
  id: number; // Internal numeric ID
  incidentID: string; // Unique identifier for the incident
  city: string;
  type: string;
  position: [number, number];
  color: [number, number, number, number]; // RGBA, so i can make it see-trough for the map
  size: number;
  datetime: string; // ISO string or formatted date/time
  severity: string;
  status: string;
  source: string;
  description: string;
};

