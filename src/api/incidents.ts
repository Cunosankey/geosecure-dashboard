import http from "./http";
import type { Incident } from "../types/incident";

export type IncidentFilters = {
  city?: string;
  type?: string;
};

export async function getIncidents(filters: IncidentFilters = {}): Promise<Incident[]> {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.type) params.set("type", filters.type);
  const qs = params.toString();
  const path = `/api/incidents${qs ? `?${qs}` : ""}`;
  return await http.get<Incident[]>(path);
}

export default { getIncidents };
