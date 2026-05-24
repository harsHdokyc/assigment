export type Status = "pending" | "flagged" | "failed" | "approved" | "rejected";
export type SourceKind = "SAP Export" | "Utility CSV" | "Travel Data";

/** UI shape for review table + record drawer (mapped from API). */
export interface ReviewRecord {
  id: string;
  displayRef: string;
  source: SourceKind;
  scope: "Scope 1" | "Scope 2" | "Scope 3" | string;
  activity: string;
  value: number;
  unit: string;
  status: Status;
  validation: string | null;
  reviewer: string;
  updated: string;
  raw: Record<string, string | number | null>;
  normalized: Record<string, string | number>;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RecordListItem {
  id: string;
  display_ref?: string;
  row_number?: number | null;
  source_type: string;
  source_label: string;
  scope: number | null;
  scope_label: string;
  activity_label: string;
  normalized_value: string | number | null;
  normalized_unit: string;
  status: Status;
  validation_summary: string | null;
  reviewer: string;
  updated_at: string;
}

export interface RecordDetail extends RecordListItem {
  raw: Record<string, unknown>;
  normalized: Record<string, string | number>;
  validation_issues: { code: string; severity: string; message: string }[];
  audit_history: {
    id: string;
    field: string;
    before: string;
    after: string;
    actor: string;
    timestamp: string;
  }[];
  locked_for_audit: boolean;
  extra_normalized?: Record<string, unknown>;
}

export interface UploadResult {
  datasource_id: string;
  source_type: string;
  filename: string;
  total_rows: number;
  failed_parse_count: number;
  failed_count: number;
  flagged_count: number;
  pending_count: number;
  processing_status: string;
}

export interface DashboardStats {
  pending: number;
  flagged: number;
  failed: number;
  approved: number;
  rejected: number;
  total_records: number;
  total_uploaded_rows: number;
}

export interface DataSourceItem {
  id: string;
  source_type: string;
  filename: string;
  processing_status: string;
  total_rows: number;
  failed_count: number;
  flagged_count: number;
  uploaded_at: string;
  uploaded_by?: string;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  record_id?: string;
  field?: string;
  before?: string;
  after?: string;
  timestamp: string;
}

export interface MeResponse {
  user: string;
  name: string;
  organizations: { id: string; name: string }[];
}
