/** Centralized TanStack Query keys — single source of truth for cache identity. */

export type RecordsListFilters = {
  status?: string;
  page?: number;
};

export const queryKeys = {
  me: ["me"] as const,
  stats: ["stats"] as const,
  datasources: ["datasources"] as const,
  audit: ["audit"] as const,
  records: {
    all: ["records"] as const,
    lists: () => [...queryKeys.records.all, "list"] as const,
    list: (filters: RecordsListFilters) => [...queryKeys.records.lists(), filters] as const,
    preview: () => [...queryKeys.records.all, "preview"] as const,
    detail: (id: string) => ["record", id] as const,
  },
} as const;
