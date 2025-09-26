

import { http } from "./http";
import type { Incident } from "../types/incident";

export async function fetchIncidents(filters: Record<string, string | undefined>): Promise<Incident[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  const path = `/api/incidents${qs ? `?${qs}` : ""}`;
  return await http.get<Incident[]>(path);
}