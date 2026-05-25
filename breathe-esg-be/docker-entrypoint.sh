#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Seeding demo user (idempotent)..."
python manage.py seed_demo

echo "Starting API..."
exec gunicorn config.wsgi --bind 0.0.0.0:8000 --workers 2
