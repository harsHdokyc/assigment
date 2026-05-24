import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  approveRecord,
  fetchRecord,
  fetchRecords,
  getOrganizationId,
  patchRecord,
  rejectRecord,
} from "@/lib/api";
import type { Paginated, RecordDetail, RecordListItem, Status } from "@/lib/types";

import { invalidateAppData } from "./invalidation";
import { queryKeys, type RecordsListFilters } from "./queries";

export function useRecords(filters: RecordsListFilters = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.records.list(filters),
    queryFn: () => fetchRecords(filters),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useRecordsPreview(enabled = false) {
  return useQuery({
    queryKey: queryKeys.records.preview(),
    queryFn: () => fetchRecords({ page: 1 }),
    enabled,
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
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

function patchRecordInLists(
  queryClient: QueryClient,
  recordId: string,
  patch: Partial<RecordListItem>
) {
  queryClient.setQueriesData<Paginated<RecordListItem>>(
    { queryKey: queryKeys.records.lists() },
    (old) =>
      old
        ? {
            ...old,
            results: old.results.map((r) => (r.id === recordId ? { ...r, ...patch } : r)),
          }
        : old
  );
}

function patchRecordDetail(
  queryClient: QueryClient,
  recordId: string,
  patch: Partial<RecordDetail>
) {
  const key = queryKeys.records.detail(recordId);
  const current = queryClient.getQueryData<RecordDetail>(key);
  if (current) {
    queryClient.setQueryData(key, { ...current, ...patch });
  }
}

function useRecordStatusMutation(
  recordId: string | null,
  nextStatus: Status,
  mutateFn: () => Promise<RecordDetail>,
  extraPatch?: Partial<RecordDetail>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutateFn,
    onMutate: async () => {
      if (!recordId) return {};
      await queryClient.cancelQueries({ queryKey: queryKeys.records.all });
      const snapshot = queryClient.getQueriesData<Paginated<RecordListItem>>({
        queryKey: queryKeys.records.lists(),
      });
      const detailSnapshot = queryClient.getQueryData<RecordDetail>(
        queryKeys.records.detail(recordId)
      );

      patchRecordInLists(queryClient, recordId, { status: nextStatus });
      patchRecordDetail(queryClient, recordId, { status: nextStatus, ...extraPatch });

      return { snapshot, detailSnapshot };
    },
    onError: (_err, _vars, context) => {
      context?.snapshot?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (context?.detailSnapshot && recordId) {
        queryClient.setQueryData(queryKeys.records.detail(recordId), context.detailSnapshot);
      }
    },
    onSuccess: (data) => {
      if (recordId) {
        queryClient.setQueryData(queryKeys.records.detail(recordId), data);
      }
    },
    onSettled: () => invalidateAppData(queryClient, recordId),
  });
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
    onSuccess: (data) => {
      if (recordId) {
        queryClient.setQueryData(queryKeys.records.detail(recordId), data);
      }
      invalidateAppData(queryClient, recordId);
    },
  });
}

export function useApproveRecord(recordId: string | null) {
  return useRecordStatusMutation(recordId, "approved", () => approveRecord(recordId!), {
    locked_for_audit: true,
  });
}

export function useRejectRecord(recordId: string | null) {
  return useRecordStatusMutation(recordId, "rejected", () => rejectRecord(recordId!));
}

export function useOrganizationId() {
  return getOrganizationId();
}
