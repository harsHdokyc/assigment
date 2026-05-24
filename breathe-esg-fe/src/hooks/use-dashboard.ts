import { useQuery } from "@tanstack/react-query";

import { fetchDataSources, fetchGlobalAudit, fetchStats } from "@/lib/api";

import { queryKeys } from "./queries";

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: fetchStats,
  });
}

export function useDataSources() {
  return useQuery({
    queryKey: queryKeys.datasources,
    queryFn: fetchDataSources,
  });
}

export function useAuditLog() {
  return useQuery({
    queryKey: queryKeys.audit,
    queryFn: fetchGlobalAudit,
  });
}
