import { useQuery } from "@tanstack/react-query";
import type { Incident } from "../types/incident";
import { fetchIncidents } from "../api/incidentsAPI";

export function useIncidents(filters: Record<string, string | undefined>) {
  return useQuery<Incident[]>({
    queryKey: ["incidents", filters],
    queryFn: () => fetchIncidents(filters),
    placeholderData: [],
  });
}