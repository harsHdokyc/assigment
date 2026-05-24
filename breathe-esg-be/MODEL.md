# Data model & architecture

## Layers

```txt
CSV Upload → DataSource + RawRecord (immutable JSONB)
          → Normalization (per source_type)
          → Validation (hard / soft rules)
          → NormalizedEmissionRecord (analyst-facing)
          → Review (PATCH / approve / reject)
          → AuditLog + locked_for_audit
```

## Entity relationships

```txt
Organization
  ├── OrganizationMembership → User
  ├── DataSource
  │     └── RawRecord (1:N)
  │           └── NormalizedEmissionRecord (1:1)
  │                 └── AuditLog (1:N)
  └── NormalizedEmissionRecord (denormalized organization FK)
```

## Multi-tenancy

- `Organization` is the tenant boundary.
- `OrganizationMembership` links users to orgs; all record/upload querysets filter by the caller's org IDs (`get_user_organization_ids`).
- `organization_id` is required on `DataSource` and denormalized on `NormalizedEmissionRecord` for efficient filtering.

---

## Organizations (`apps/organizations`)

### Organization

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | PK |
| `name` | string | Display name |
| `created_at` | datetime | |

### OrganizationMembership

| Field | Type | Notes |
|-------|------|-------|
| `organization` | FK → Organization | |
| `user` | FK → User | |
| Unique | `(organization, user)` | One membership per pair |

---

## Ingestion (`apps/ingestion`)

### SourceType (choices on `DataSource.source_type`)

| Value | Label | Normalizer |
|-------|-------|------------|
| `sap` | SAP Export | `normalize_sap` |
| `utility` | Utility CSV | `normalize_utility` |
| `travel` | Travel Data | `normalize_travel` |

### DataSource

One uploaded file per row. Tracks processing aggregates.

| Field | Type | Notes |
|-------|------|-------|
| `organization` | FK → Organization | Tenant |
| `source_type` | enum | `sap` / `utility` / `travel` |
| `ingestion_method` | string | Default `csv_upload` |
| `filename` | string | Original file name |
| `uploaded_by` | FK → User | Nullable |
| `processing_status` | enum | `pending` → `processing` → `completed` \| `failed` |
| `total_rows` | int | Row count after ingest |
| `failed_count` | int | Rows that failed normalization |
| `flagged_count` | int | Rows with validation warnings |

### RawRecord

Immutable source row. Never updated after insert.

| Field | Type | Notes |
|-------|------|-------|
| `datasource` | FK → DataSource | |
| `row_number` | int | 1-based line in file |
| `raw_payload` | JSON | Original headers/values as received |
| `processing_status` | string | Per-row pipeline status |
| `error_message` | text | Set when normalization fails |

---

## Records (`apps/records`)

### GHG scope (`NormalizedEmissionRecord.scope`)

Integer **1**, **2**, or **3** — standard greenhouse-gas reporting buckets (not org/user “scope”).

| Scope | Meaning | Assigned by | Example activity |
|-------|---------|-------------|------------------|
| **1** | Direct emissions | SAP / fuel uploads | Diesel at plant `PLT100` |
| **2** | Purchased energy | Utility uploads | Grid electricity at a facility |
| **3** | Value chain / travel | Travel uploads | Flights, rail, hotel, taxi |

API returns `scope` (int) and `scope_label` (e.g. `"Scope 1"`). List filter: `GET /api/records/?scope=1`.

Related field: `category` — finer-grained type (`fuel_combustion`, `purchased_electricity`, `air_travel`, etc.).

### RecordStatus

| Status | Set by | Meaning |
|--------|--------|---------|
| `pending` | Pipeline (automatic) | Normalized cleanly; no validation issues |
| `flagged` | Pipeline (automatic) | Soft validation warnings only; needs analyst attention |
| `failed` | Pipeline (automatic) | Hard validation failure or normalization crash |
| `approved` | Analyst (`POST …/approve/`) | Accepted for reporting; locked |
| `rejected` | Analyst (`POST …/reject/`) | Declined; stays editable |

#### When each status is assigned

Statuses are chosen in **`apps/validation/rules.py`** (`apply_validation`) after normalization, or in **`apps/normalization/pipeline.py`** if normalization throws.

**`pending`** — assigned when:

- Normalization succeeds, and
- Validation finds **no issues**, or only issues that do not apply (no hard rules triggered, no soft rules triggered).

The row is ready for routine review with nothing flagged.

**`flagged`** — assigned when:

- Normalization succeeds, and
- At least one validation issue has **`severity: "soft"`**, and
- **No** hard failures.

Soft rules (examples):

| Source | Code | Trigger |
|--------|------|---------|
| SAP | `unknown_plant` | Plant code not in known list |
| SAP | `missing_emission_factor` | No matching factor (default used) |
| Utility | `usage_spike` | Normalized kWh above spike threshold |
| Utility | `missing_emission_factor` | Same as above |
| Travel | `unrealistic_distance` | Air distance above max realistic km |
| Travel | `missing_emission_factor` | Same as above |

Flagged records appear in the Review queue; analysts can PATCH, approve, or reject.

**`failed`** — assigned when:

1. **Hard validation** — any issue with **`severity: "hard"`**, or  
2. **Normalization exception** — normalizer raises; pipeline creates a row with `activity_label="Normalization error"` and `code: normalize_error`.

Hard rules (examples):

| Source | Code | Trigger |
|--------|------|---------|
| SAP | `unknown_unit` | Unit not in supported set |
| SAP | `missing_quantity` | Missing activity quantity |
| Utility | `negative_consumption` | Negative normalized consumption |
| Utility | `missing_consumption` | Missing consumption value |
| Travel | `missing_airport` | Flight missing destination |
| Travel | `missing_route` | Missing route / origin data |

Failed rows are still stored as `NormalizedEmissionRecord` (for visibility); `DataSource.failed_count` is incremented on upload processing.

**`approved`** — assigned only when an analyst calls:

```http
POST /api/records/<id>/approve/
```

Effects:

- `status` → `approved`
- `locked_for_audit` → `True` (PATCH returns **403**)
- `reviewed_by` / `reviewed_at` set
- `AuditLog` entry for `status` change

Can be called from `pending` or `flagged` (and in principle from other statuses if not already locked). Not allowed if already `locked_for_audit`.

**`rejected`** — assigned only when an analyst calls:

```http
POST /api/records/<id>/reject/
```

Effects:

- `status` → `rejected`
- `reviewed_by` / `reviewed_at` set
- `locked_for_audit` stays **`False`** (record remains PATCH-able)
- `AuditLog` entry for `status` change

Blocked if `locked_for_audit` is already `True` (e.g. previously approved).

**PATCH does not change status** — editing fields via `PATCH /api/records/<id>/` updates data and writes field-level `AuditLog` rows, but leaves `pending` / `flagged` / `failed` unchanged unless the analyst approves or rejects.

### NormalizedEmissionRecord

Analyst-facing canonical row. Linked 1:1 to `RawRecord`.

| Field | Type | Notes |
|-------|------|-------|
| `organization` | FK → Organization | Denormalized tenant |
| `raw_record` | OneToOne → RawRecord | Lineage |
| `datasource` | FK → DataSource | Upload source |
| `category` | string | e.g. `fuel_combustion` |
| `scope` | smallint | 1, 2, or 3 (nullable) |
| `activity_date` | date | ISO-normalized |
| `activity_label` | string | Display name (e.g. `Diesel B7 — PLT100`) |
| `activity_value` / `activity_unit` | decimal / string | As reported in source |
| `normalized_value` / `normalized_unit` | decimal / string | After unit conversion (e.g. L, kWh, km) |
| `emission_factor` | decimal | Optional factor applied |
| `calculated_emissions` | decimal | Optional CO₂e output |
| `facility` / `vendor` / `employee` | string | Context dimensions |
| `extra_normalized` | JSON | Source-specific fields for detail view |
| `validation_issues` | JSON | List of `{message, ...}` warnings/errors |
| `status` | enum | See RecordStatus |
| `reviewed_by` / `reviewed_at` | FK / datetime | Set on approve/reject |
| `locked_for_audit` | bool | `True` after approve; blocks PATCH |

**Indexes:** `(organization, status)`, `datasource`, `raw_record`.

**Editable via PATCH** (until locked): `category`, dates, activity/normalized values, facility, vendor, employee, `extra_normalized`, etc. — see `EDITABLE_FIELDS` in `records/serializers.py`.

---

## Audit (`apps/audit`)

### AuditLog

One row per changed field on PATCH.

| Field | Type | Notes |
|-------|------|-------|
| `record` | FK → NormalizedEmissionRecord | |
| `field_name` | string | e.g. `activity_label` |
| `old_value` / `new_value` | text | Serialized values |
| `changed_by` | FK → User | |
| `changed_at` | datetime | |

---

## Raw vs normalized

| Store | Mutable? | Purpose |
|-------|----------|---------|
| `RawRecord.raw_payload` | Never | Audit trail, reprocessing |
| `NormalizedEmissionRecord` | Yes (until lock) | Analyst review, reporting prep |

## Record lifecycle

```txt
Upload + normalize + validate
         │
         ├─ hard error / normalize crash ──► failed
         ├─ soft warnings only ────────────► flagged
         └─ clean ─────────────────────────► pending
                    │
                    │  analyst review
                    ▼
         ┌──────────┴──────────┐
         ▼                     ▼
    POST approve           POST reject
         │                     │
         ▼                     ▼
    approved               rejected
    (locked)               (editable)
```

| From | Action | To |
|------|--------|-----|
| — | Pipeline, no issues | `pending` |
| — | Pipeline, soft issues only | `flagged` |
| — | Pipeline, hard issue or exception | `failed` |
| `pending` / `flagged` / … | `POST …/approve/` | `approved` (+ lock) |
| `pending` / `flagged` / … | `POST …/reject/` | `rejected` |
| `approved` | `PATCH` | **403** (locked) |
| `rejected` | `PATCH` | Allowed (status unchanged) |

## API list filters

`GET /api/records/` supports (all org-scoped):

| Query param | Filters on |
|-------------|------------|
| `status` | `RecordStatus` |
| `source_type` | `DataSource.source_type` |
| `scope` | `scope` (1, 2, or 3) |
| `page` | DRF pagination (25 per page) |
