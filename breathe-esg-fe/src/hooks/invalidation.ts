import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "./queries";

/** Invalidate caches after uploads or record workflow changes. */
export function invalidateAppData(queryClient: QueryClient, recordId?: string | null) {
  queryClient.invalidateQueries({ queryKey: queryKeys.stats });
  queryClient.invalidateQueries({ queryKey: queryKeys.datasources });
  queryClient.invalidateQueries({ queryKey: queryKeys.audit });
  queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
  if (recordId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.records.detail(recordId) });
  }
}
