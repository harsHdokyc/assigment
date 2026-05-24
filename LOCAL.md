# Local development (manual)

Run **two terminals** — backend first, then frontend.

## 1. Backend (`breathe-esg-be`)

```powershell
cd breathe-esg-be
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

- API: http://127.0.0.1:8000  
- **Do not set `DATABASE_URL` in `.env` unless Postgres is running** — omit it to use SQLite (`db.sqlite3`).
- Login: `analyst` / `demo1234`
- Optional sample uploads: `breathe-esg-be\samples\*.csv` via the app **Upload** page or README curl examples.

## 2. Frontend (`breathe-esg-fe`)

```powershell
cd breathe-esg-fe
npm install
copy .env.example .env
npm run dev
```

- UI: http://localhost:5173  
- `VITE_API_URL` must point at the backend (default `http://127.0.0.1:8000`).

## Quick health check

```powershell
# After runserver is up:
$body = '{"username":"analyst","password":"demo1234"}'
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/auth/token/ -Method POST -Body $body -ContentType application/json
```

## Common issues

| Symptom | Fix |
|--------|-----|
| `connection refused` on port 5432 | Remove `DATABASE_URL` from `breathe-esg-be\.env` (use SQLite). |
| Login works in curl but not browser | Add your Vite origin to `CORS_ALLOWED_ORIGINS` (both `localhost` and `127.0.0.1` are in `.env.example`). |
| Empty dashboard | Expected after `seed_demo` — upload CSVs from `breathe-esg-be\samples\` via the **Upload** page. |
| `venv` creation fails on Windows | Close other terminals using `.venv`, delete `.venv`, run `python -m venv .venv` again. |
