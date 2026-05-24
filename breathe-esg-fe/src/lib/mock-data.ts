export type Status = "pending" | "flagged" | "failed" | "approved" | "rejected";
export type SourceKind = "SAP Export" | "Utility CSV" | "Travel Data";

export interface UploadRow {
  id: string;
  source: SourceKind;
  uploadedBy: string;
  rows: number;
  failed: number;
  status: "processing" | "validated" | "review" | "locked" | "failed";
  date: string;
}

export interface ReviewRecord {
  id: string;
  source: SourceKind;
  scope: "Scope 1" | "Scope 2" | "Scope 3";
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

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  field?: string;
  before?: string;
  after?: string;
  timestamp: string;
}

export const uploads: UploadRow[] = [
  { id: "UPL-4421", source: "SAP Export", uploadedBy: "M. Aoki", rows: 12480, failed: 24, status: "review", date: "2026-05-22 14:02" },
  { id: "UPL-4420", source: "Utility CSV", uploadedBy: "S. Patel", rows: 3204, failed: 0, status: "validated", date: "2026-05-22 11:48" },
  { id: "UPL-4419", source: "Travel Data", uploadedBy: "J. Bauer", rows: 884, failed: 11, status: "review", date: "2026-05-22 09:15" },
  { id: "UPL-4418", source: "SAP Export", uploadedBy: "M. Aoki", rows: 8920, failed: 0, status: "locked", date: "2026-05-21 17:30" },
  { id: "UPL-4417", source: "Utility CSV", uploadedBy: "L. Chen", rows: 1502, failed: 3, status: "processing", date: "2026-05-21 16:04" },
  { id: "UPL-4416", source: "Travel Data", uploadedBy: "R. Okafor", rows: 612, failed: 0, status: "locked", date: "2026-05-21 10:22" },
  { id: "UPL-4415", source: "SAP Export", uploadedBy: "M. Aoki", rows: 15240, failed: 188, status: "failed", date: "2026-05-20 19:11" },
];

export const reviewQueue: ReviewRecord[] = [
  {
    id: "REC-90021", source: "Utility CSV", scope: "Scope 2", activity: "Grid electricity — Frankfurt DC", value: 482104, unit: "kWh",
    status: "flagged", validation: "Spike vs 12-mo baseline (+41%)", reviewer: "S. Patel", updated: "2m ago",
    raw: { meter_id: "DE-FRA-441", reading_kwh: "482104.0000", period: "2026-04", supplier: "EnBW", tariff: "GRN-2-Comm" },
    normalized: { facility: "Frankfurt DC", scope: "2", activity_kwh: 482104, emission_factor: 0.338, co2e_kg: 162951, period_start: "2026-04-01", period_end: "2026-04-30" },
  },
  {
    id: "REC-90020", source: "Travel Data", scope: "Scope 3", activity: "Air travel — LHR → SFO", value: 8714, unit: "km",
    status: "flagged", validation: "Missing destination airport code", reviewer: "J. Bauer", updated: "8m ago",
    raw: { traveler: "emp_22841", from: "LHR", to: "", class: "business", distance_km: 8714 },
    normalized: { route: "LHR-SFO", cabin: "Business", distance_km: 8714, emission_factor: 0.243, co2e_kg: 2117 },
  },
  {
    id: "REC-90019", source: "SAP Export", scope: "Scope 1", activity: "Diesel — Fleet Region EU-W", value: 14820, unit: "L",
    status: "pending", validation: null, reviewer: "M. Aoki", updated: "14m ago",
    raw: { gl_account: "640210", cost_center: "FLT-EUW", quantity: 14820, uom: "L", doc_no: "SAP-99124" },
    normalized: { fuel: "Diesel B7", scope: "1", quantity_l: 14820, emission_factor: 2.68, co2e_kg: 39718 },
  },
  {
    id: "REC-90018", source: "Utility CSV", scope: "Scope 2", activity: "Grid electricity — Dublin Office", value: 22408, unit: "kWh",
    status: "pending", validation: null, reviewer: "S. Patel", updated: "1h ago",
    raw: { meter_id: "IE-DUB-12", reading_kwh: "22408", period: "2026-04", supplier: "ESB" },
    normalized: { facility: "Dublin HQ", scope: "2", activity_kwh: 22408, emission_factor: 0.296, co2e_kg: 6633 },
  },
  {
    id: "REC-90017", source: "SAP Export", scope: "Scope 1", activity: "Natural gas — Munich Plant", value: 88420, unit: "m³",
    status: "approved", validation: null, reviewer: "M. Aoki", updated: "3h ago",
    raw: { gl_account: "640105", cost_center: "MUC-PLT", quantity: 88420, uom: "M3" },
    normalized: { fuel: "Natural gas", scope: "1", quantity_m3: 88420, emission_factor: 1.91, co2e_kg: 168882 },
  },
  {
    id: "REC-90016", source: "Travel Data", scope: "Scope 3", activity: "Rail — Paris → Brussels", value: 312, unit: "km",
    status: "approved", validation: null, reviewer: "J. Bauer", updated: "5h ago",
    raw: { traveler: "emp_11023", from: "PAR", to: "BRU", mode: "rail", distance_km: 312 },
    normalized: { route: "PAR-BRU", mode: "Rail", distance_km: 312, emission_factor: 0.035, co2e_kg: 11 },
  },
  {
    id: "REC-90015", source: "Utility CSV", scope: "Scope 2", activity: "Grid electricity — Singapore DC", value: 0, unit: "kWh",
    status: "failed", validation: "Invalid unit (expected kWh, got null)", reviewer: "L. Chen", updated: "6h ago",
    raw: { meter_id: "SG-SIN-9", reading_kwh: null, period: "2026-04" },
    normalized: {},
  },
  {
    id: "REC-90014", source: "SAP Export", scope: "Scope 1", activity: "Refrigerant R-410A — HQ", value: 12.4, unit: "kg",
    status: "rejected", validation: "Duplicate of REC-90011", reviewer: "M. Aoki", updated: "1d ago",
    raw: { gl_account: "640330", quantity: 12.4, uom: "KG", doc_no: "SAP-99084" },
    normalized: { refrigerant: "R-410A", scope: "1", quantity_kg: 12.4, gwp: 2088, co2e_kg: 25891 },
  },
];

export const auditLog: AuditEntry[] = [
  { id: "a1", actor: "S. Patel", action: "Flagged record", target: "REC-90021", timestamp: "2026-05-24 09:42:11" },
  { id: "a2", actor: "M. Aoki", action: "Approved record", target: "REC-90017", field: "status", before: "pending", after: "approved", timestamp: "2026-05-24 09:31:08" },
  { id: "a3", actor: "system", action: "Validation completed", target: "UPL-4420", timestamp: "2026-05-24 09:14:55" },
  { id: "a4", actor: "J. Bauer", action: "Edited normalized value", target: "REC-90020", field: "distance_km", before: "8200", after: "8714", timestamp: "2026-05-24 08:58:02" },
  { id: "a5", actor: "M. Aoki", action: "Locked dataset", target: "UPL-4418", timestamp: "2026-05-23 17:30:44" },
  { id: "a6", actor: "L. Chen", action: "Uploaded dataset", target: "UPL-4417", timestamp: "2026-05-23 16:04:22" },
  { id: "a7", actor: "system", action: "Ingestion started", target: "UPL-4417", timestamp: "2026-05-23 16:04:18" },
  { id: "a8", actor: "M. Aoki", action: "Rejected record", target: "REC-90014", field: "status", before: "pending", after: "rejected", timestamp: "2026-05-23 14:11:05" },
];

export const stats = {
  pending: 142,
  failed: 23,
  approved: 1284,
  totalRows: 42_886,
  pendingTrend: "+8 today",
  failedTrend: "-4 vs yesterday",
  approvedTrend: "+128 this week",
  rowsTrend: "+3,204 today",
};
