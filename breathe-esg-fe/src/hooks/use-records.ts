import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveRecord,
  fetchRecord,
  fetchRecords,
  getOrganizationId,
  patchRecord,
  rejectRecord,
} from "@/lib/api";
import type { RecordDetail } from "@/lib/types";

import { invalidateAppData } from "./invalidation";
import { queryKeys, type RecordsListFilters } from "./queries";

export function useRecords(filters: RecordsListFilters = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.records.list(filters),
    queryFn: () => fetchRecords(filters),
    enabled,
  });
}

export function useRecordsPreview(enabled = false) {
  return useQuery({
    queryKey: queryKeys.records.preview(),
    queryFn: () => fetchRecords({ page: 1 }),
    enabled,
  });
}

export function useFlaggedRecords() {
  return useRecords({ status: "flagged", page: 1 });
}

export function useRecord(recordId: string | null) {
  return useQuery({
    queryKey: queryKeys.records.detail(recordId ?? ""),
    queryFn: () => fetchRecord(recordId!),
    enabled: !!recordId,
  });
}

function buildPatchBody(
  detail: RecordDetail,
  edits: Record<string, string>
): Record<string, unknown> {
  const extra = { ...(detail.extra_normalized ?? {}) };
  const body: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(edits)) {
    if (!(k in (detail.normalized ?? {}))) continue;
    if (k === "value") body.normalized_value = v;
    else if (k === "unit") body.normalized_unit = v;
    else if (k === "activity") body.activity_label = v;
    else if (k === "facility") body.facility = v;
    else extra[k] = v;
  }
  if (Object.keys(extra).length) body.extra_normalized = extra;
  return body;
}

export function usePatchRecord(recordId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      detail,
      edits,
    }: {
      detail: RecordDetail;
      edits: Record<string, string>;
    }) => patchRecord(recordId!, buildPatchBody(detail, edits)),
    onSuccess: () => invalidateAppData(queryClient, recordId),
  });
}

export function useApproveRecord(recordId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveRecord(recordId!),
    onSuccess: () => invalidateAppData(queryClient, recordId),
  });
}

export function useRejectRecord(recordId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectRecord(recordId!),
    onSuccess: () => invalidateAppData(queryClient, recordId),
  });
}

export function useOrganizationId() {
  return getOrganizationId();
}
