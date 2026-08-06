#!/bin/sh
set -e

cd /app/backend

echo "→ Running migrations..."
python manage.py migrate --noinput

echo "→ Collecting static files..."
python manage.py collectstatic --noinput

# Seed optional superuser on first boot if env vars are set.
if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  echo "→ Ensuring superuser exists..."
  python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
u = os.environ.get('DJANGO_SUPERUSER_USERNAME')
p = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
e = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
if not User.objects.filter(username=u).exists():
    User.objects.create_superuser(username=u, email=e, password=p)
    print(f'   Created superuser: {u}')
else:
    print(f'   Superuser {u} already exists.')
"
fi

# Seed sample content (only if requested; safe to run multiple times)
if [ "${SEED_SAMPLE_DATA:-false}" = "true" ]; then
  echo "→ Seeding sample data..."
  python manage.py seed_sample || echo "   Seed skipped (already exists)."
fi

echo "→ Starting Gunicorn..."
exec gunicorn config.wsgi:application \
  --bind "0.0.0.0:${PORT:-8000}" \
  --workers "${GUNICORN_WORKERS:-2}" \
  --threads "${GUNICORN_THREADS:-2}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
