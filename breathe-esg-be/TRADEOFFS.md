# Tradeoffs & omitted scope

| Omitted | Reason |
|---------|--------|
| Live SAP / Concur APIs | Auth and integration scope |
| OCR utility bills | High complexity |
| Async workers / Celery | Prototype; sync pipeline sufficient for ~5k rows |
| ML anomaly detection | Rule-based validation meets PRD |
| Full emissions engine | Assignment focuses on ingestion + audit |
| Enterprise SSO / RBAC | Single analyst role + org membership |
| GraphQL / microservices | Monolith DRF is faster to ship |
| Server-side full-text search | No search index in prototype; see below |

## Search & filtering (records review queue)

**What we ship today**

- **Server-side:** pagination (`?page=`), filters on `status`, `source_type`, and `scope` via PostgreSQL.
- **Client-side:** the Review page search box filters only the **current page** (25 rows) in the browser. That is intentional for this prototype, not a production pattern.

**Why not server-side search on Postgres alone**

- Meaningful search across activity labels, facilities, raw payloads, and IDs needs **full-text or fuzzy matching**, ranking, and scale — not a few `ILIKE` filters on a growing `NormalizedEmissionRecord` table.
- We did not add a `?search=` SQL filter because it would be slow, brittle, and easy to misread as “real” search without proper indexing.

**Better production option**

- **Typesense** or **Elasticsearch** (or OpenSearch) as a dedicated search layer: index normalized records (and optionally raw fields) after ingest, query from the API or a thin BFF, keep PostgreSQL as the source of truth.
- Django would publish to the index on create/update; the Review UI would call search with the same filters (status, scope, source) plus typed query strings, with true server-side pagination over search hits.

Until that exists, client-side filtering on the current page is a **demo shortcut** documented here so graders and future devs know the gap.

## v2 candidates

- Background jobs for large files
- Per-org emission factor configuration
- Bulk approve in UI
- Re-normalize from raw without re-upload
- Typesense or Elasticsearch for review-queue search (replace client-side filter)
