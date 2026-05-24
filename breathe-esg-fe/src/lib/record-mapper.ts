import type { RecordDetail, RecordListItem, ReviewRecord, SourceKind } from "./types";
import { formatRelative } from "./api";

const SOURCE_MAP: Record<string, SourceKind> = {
  sap: "SAP Export",
  utility: "Utility CSV",
  travel: "Travel Data",
};

export function mapListItem(r: RecordListItem): ReviewRecord {
  return {
    id: r.id,
    source: (r.source_label || SOURCE_MAP[r.source_type]) as SourceKind,
    scope: (r.scope_label || `Scope ${r.scope}`) as ReviewRecord["scope"],
    activity: r.activity_label,
    value: Number(r.normalized_value) || 0,
    unit: r.normalized_unit,
    status: r.status,
    validation: r.validation_summary,
    reviewer: r.reviewer || "—",
    updated: formatRelative(r.updated_at),
    raw: {},
    normalized: {},
  };
}

export function mapDetail(r: RecordDetail): ReviewRecord {
  return {
    ...mapListItem(r),
    raw: r.raw as Record<string, string | number | null>,
    normalized: r.normalized as Record<string, string | number>,
  };
}
