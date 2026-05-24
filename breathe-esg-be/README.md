# Breathe ESG — Backend API

Django + DRF API for emissions data ingestion and analyst review.  
Frontend lives in [`../breathe-esg-fe`](../breathe-esg-fe).

## Quick start (local)

```bash
cd breathe-esg-be
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env            # SQLite by default; set DATABASE_URL only for Postgres
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

**Demo credentials** (after `seed_demo`):

| Field | Value |
|-------|--------|
| Username | `analyst` |
| Password | `demo1234` |

Get JWT: `POST http://127.0.0.1:8000/api/auth/token/`  
Body: `{"username":"analyst","password":"demo1234"}`

## Environment

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret |
| `DEBUG` | `True` for local dev |
| `DATABASE_URL` | Optional. Postgres URL for production/Docker; **omit for local SQLite** |
| `CORS_ALLOWED_ORIGINS` | e.g. `http://localhost:5173` |

## API (Phase 1 skeleton)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/token/` | JWT login |
| POST | `/api/uploads/` | CSV upload → `RawRecord` rows (see `samples/`) |
| GET | `/api/records/` | List records (`?status=`, `?source_type=`, `?scope=`) |
| GET/PATCH | `/api/records/<id>/` | Detail / edit (403 if locked) |
| POST | `/api/records/<id>/approve/` | Approve + lock |
| POST | `/api/records/<id>/reject/` | Reject |
| GET | `/api/audit/<record_id>/` | Field-level audit history |

## Project layout

```txt
breathe-esg-be/
├── config/           # Django settings & URLs
├── apps/
│   ├── organizations/
│   ├── ingestion/    # DataSource, RawRecord, uploads
│   ├── records/      # NormalizedEmissionRecord, review APIs
│   └── audit/        # AuditLog
├── samples/          # Test CSV fixtures (Phase 2)
└── manage.py
```

## Sample uploads

```bash
# After seed_demo and runserver — use org ID from seed output
curl -X POST http://127.0.0.1:8000/api/uploads/ \
  -H "Authorization: Bearer <token>" \
  -F "file=@samples/sap_fuel.csv" \
  -F "source_type=sap" \
  -F "organization_id=<org-uuid>"
```

See [`SOURCES.md`](./SOURCES.md) for fixture edge cases.

## Deploy (Railway)

1. New project from `breathe-esg-be`, add PostgreSQL
2. Env: `SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (your Vercel URL)
3. Start: `gunicorn config.wsgi` (see `Procfile`)
4. Release: `python manage.py migrate && python manage.py seed_demo`

## Stack

Upload → raw rows → normalize → validate → review APIs → audit lock. See `MODEL.md`, `DECISIONS.md`, `TRADEOFFS.md`.
