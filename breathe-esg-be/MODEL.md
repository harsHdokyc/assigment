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

## Multi-tenancy

- `Organization` is the tenant boundary.
- `OrganizationMembership` links users to orgs; all queries filter by the caller's org IDs.
- `organization_id` is required on uploads and denormalized on `NormalizedEmissionRecord`.

## Raw vs normalized

| Store | Mutable? | Purpose |
|-------|----------|---------|
| `RawRecord.raw_payload` | Never | Audit trail, reprocessing |
| `NormalizedEmissionRecord` | Yes (until lock) | Analyst review, reporting prep |

## Record lifecycle

`pending` → (`flagged` optional) → `approved` | `rejected` | `failed`

On **approve**: `locked_for_audit=True`; PATCH returns 403.

## Audit

Each PATCH writes one `AuditLog` row per changed field (`old_value`, `new_value`, `changed_by`, `changed_at`).
