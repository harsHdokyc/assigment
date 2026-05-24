# Engineering decisions

## Source formats

- **CSV flat files** for SAP, utility, and travel — avoids live SAP/OCR complexity while staying realistic.

## Database

- **PostgreSQL** in production; **SQLite** fallback when `DATABASE_URL` is unset (local dev).

## Auth

- **JWT** (SimpleJWT) for prototype; no SSO/RBAC.

## Reject vs lock

- **Reject** does not lock the record; analyst could theoretically re-open via PATCH (status not forced to locked).
- **Approve** always sets `locked_for_audit=True`.

## Emission factors

- Static lookup table in `apps/normalization/base.py` — not a full emissions engine.
- Missing factor → soft flag, still stores record.

## Date parsing

- Supports `DD.MM.YYYY`, `YYYY-MM-DD`, `MM/DD/YYYY` — common export variants.

## Travel distance

- Uses stated `distance_km` when present; otherwise a small airport-pair lookup table for demo routes.
