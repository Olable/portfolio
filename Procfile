# For Render (native runtime, non-Docker) or Heroku-style platforms.
# Prefers the Dockerfile when present; Procfile is a fallback.
web: cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120
release: cd backend && python manage.py migrate --noinput && python manage.py collectstatic --noinput
