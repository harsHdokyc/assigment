# Run with Docker

One command starts Postgres, the API, and the web UI.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2)

## Start

From the repo root (`assigment/`):

```bash
docker compose up --build
```

First run downloads images and builds; later runs are faster.

## Use the app

| Service   | URL |
|-----------|-----|
| Web UI    | http://localhost:3000 |
| API       | http://localhost:8000 |

**Demo login** (created on startup):

| Field    | Value      |
|----------|------------|
| Username | `analyst`  |
| Password | `demo1234` |

Sample CSVs for upload: `breathe-esg-be/samples/`

## Stop

```bash
docker compose down
```

Data is kept in the `postgres_data` volume. To wipe the database:

```bash
docker compose down -v
```

## Customize API URL for the UI

The frontend is built with `VITE_API_URL` (default `http://localhost:8000`). If you change the published API port, rebuild:

```bash
docker compose build --build-arg VITE_API_URL=http://localhost:YOUR_PORT frontend
docker compose up
```

Or edit `docker-compose.yml` under `frontend.build.args`.

## Manual dev (no Docker)

See [LOCAL.md](./LOCAL.md).
