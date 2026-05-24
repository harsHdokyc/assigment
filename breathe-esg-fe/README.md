# Breathe ESG — Frontend

React + TypeScript analyst UI for emissions data ingestion and review.

Backend API: [`../breathe-esg-be`](../breathe-esg-be)

## Setup

```bash
npm install
copy .env.example .env    # Windows — or: cp .env.example .env
npm run dev
```

Open http://localhost:5173 → **Sign in** at `/login` (default: `analyst` / `demo1234` after backend `seed_demo`).

## API layer

- **Axios** — `src/lib/api.ts` (HTTP client, JWT interceptor, 401 → `/login`)
- **TanStack Query** — `src/lib/query-client.ts`
- **Hooks** — `src/hooks/` (`queryKeys`, `useRecords`, `useUpload`, `useLogin`, …)

Components import hooks only; they do not call `fetch*` directly.

## Environment

| Variable | Default |
|----------|---------|
| `VITE_API_URL` | `http://127.0.0.1:8000` |

## Deploy (Vercel)

1. Import repo, root directory `breathe-esg-fe`
2. Set `VITE_API_URL` to your Railway backend URL
3. Build: `npm run build`, output `dist`
