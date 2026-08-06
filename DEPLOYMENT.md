# Deployment Guide

The app is containerized with Docker and ships with pre-made configs for:

- ✅ **Render** (1-click via `render.yaml` Blueprint)
- ✅ **Railway** (via `railway.json`)
- ✅ Any Docker host (VPS, Digital Ocean App Platform, Fly.io, etc.)
- ✅ Traditional VPS (Nginx + Gunicorn)

---

## 🎯 Option 1 — Deploy to Render (easiest, free tier available)

### One-click Blueprint (recommended)

1. Push your code to GitHub (already done → https://github.com/Olable/portfolio).
2. Go to https://dashboard.render.com/blueprints and click **"New Blueprint Instance"**.
3. Connect your GitHub account and select the **`portfolio`** repo.
4. Render will read `render.yaml` and provision:
   - A PostgreSQL database (free plan)
   - A Web Service (free plan) built from the Dockerfile
   - Auto-generated secret key & superuser password
5. Wait ~5–10 minutes for the first build. Your site will be live at
   `https://olable-portfolio.onrender.com` (or the name you choose).

The `SEED_SAMPLE_DATA` env var is **off** by default — if you want the demo posts/projects, add it and set to `true`, then re-deploy.

### Manual Render setup (without Blueprint)

If you prefer to configure manually:

1. **New → PostgreSQL** → create a free Postgres, copy its **Internal Database URL**.
2. **New → Web Service** → connect your repo.
   - **Environment**: `Docker`
   - **Root Directory**: (leave empty)
   - **Dockerfile Path**: `./Dockerfile`
   - Add environment variables:
     | Key | Value |
     |-----|-------|
     | `DJANGO_DEBUG` | `False` |
     | `DJANGO_SECRET_KEY` | (generate a long random string) |
     | `DJANGO_ALLOWED_HOSTS` | `.onrender.com,localhost,127.0.0.1` |
     | `SEED_SAMPLE_DATA` | `true` (optional) |
     | `DJANGO_SUPERUSER_USERNAME` | `olable` |
     | `DJANGO_SUPERUSER_EMAIL` | your email |
     | `DJANGO_SUPERUSER_PASSWORD` | pick a strong password |
     | `DATABASE_URL` | (paste from your Postgres service) |
     | `DB_ENGINE` | `django.db.backends.postgresql` |
     | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | (from Postgres service) |

3. Click **Create Web Service**.

---

## 🚄 Option 2 — Deploy to Railway

1. Go to https://railway.app/new → **Deploy from GitHub repo** → pick `Olable/portfolio`.
2. Railway will auto-detect the Dockerfile (via `railway.json`).
3. **Add a PostgreSQL plugin** to your project (New → Database → Postgres).
   Railway will automatically inject `DATABASE_URL`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.
4. Add these environment variables to the service:

   | Key | Value |
   |-----|-------|
   | `DJANGO_DEBUG` | `False` |
   | `DJANGO_SECRET_KEY` | (generate a long random string) |
   | `DJANGO_ALLOWED_HOSTS` | `.up.railway.app,.railway.app,localhost,127.0.0.1` |
   | `DB_ENGINE` | `django.db.backends.postgresql` |
   | `DB_NAME` | `${{PGDATABASE}}` |
   | `DB_USER` | `${{PGUSER}}` |
   | `DB_PASSWORD` | `${{PGPASSWORD}}` |
   | `DB_HOST` | `${{PGHOST}}` |
   | `DB_PORT` | `${{PGPORT}}` |
   | `SEED_SAMPLE_DATA` | `true` (optional) |
   | `DJANGO_SUPERUSER_USERNAME` | `olable` |
   | `DJANGO_SUPERUSER_PASSWORD` | (choose a strong password) |
   | `DJANGO_SUPERUSER_EMAIL` | your email |

5. Click **Deploy**. The first deploy takes ~5 minutes.
6. Once deployed, go to the service → **Settings → Networking** and click **Generate Domain**.
   Your site will be live at `https://<project-name>.up.railway.app`.

### Quick-start template (CLI)

If you have the Railway CLI:

```bash
npm i -g @railway/cli
railway login
railway init
railway add postgres
railway up
railway domain
```

---

## 🐳 Option 3 — Any Docker host (VPS, Fly.io, DigitalOcean, etc.)

The Docker image is self-contained (React built, static files collected, migrations run on boot):

```bash
# Build
docker build -t olable-portfolio .

# Run with Postgres (replace DATABASE_URL)
docker run -p 8000:8000 \
  -e DJANGO_SECRET_KEY=your-random-key \
  -e DJANGO_DEBUG=False \
  -e DJANGO_ALLOWED_HOSTS=yourdomain.com,localhost \
  -e DB_ENGINE=django.db.backends.postgresql \
  -e DB_NAME=olable \
  -e DB_USER=olable \
  -e DB_PASSWORD=secret \
  -e DB_HOST=your-postgres-host \
  -e DB_PORT=5432 \
  -e SEED_SAMPLE_DATA=true \
  -e DJANGO_SUPERUSER_USERNAME=olable \
  -e DJANGO_SUPERUSER_PASSWORD=strongpass \
  olable-portfolio
```

Then put Nginx/Caddy in front as a reverse proxy terminating TLS on port 443.

---

## 🖥 Option 4 — Traditional VPS (no Docker)

```bash
# On your server (Ubuntu example)
sudo apt update && sudo apt install -y python3-venv python3-dev build-essential libpq-dev nginx postgresql postgresql-contrib

git clone https://github.com/Olable/portfolio.git
cd portfolio

# Backend
python3 -m venv venv && source venv/bin/activate
pip install -r backend/requirements.txt
cd backend
# Build the frontend first (need Node 18+):
# (cd ../frontend && npm ci && npm run build && mkdir -p ../backend/static/frontend && cp -r dist/* ../backend/static/frontend/)
export DJANGO_SECRET_KEY=...
export DJANGO_DEBUG=False
export DJANGO_ALLOWED_HOSTS=yourdomain.com
export DB_ENGINE=django.db.backends.postgresql
export DB_NAME=..., DB_USER=..., DB_PASSWORD=..., DB_HOST=..., DB_PORT=...
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

# Gunicorn service (/etc/systemd/system/portfolio.service)
# [Service]
# User=www-data
# WorkingDirectory=/opt/portfolio/backend
# ExecStart=/opt/portfolio/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3 --timeout 120
# ...then systemctl enable --now portfolio

# Nginx config — serve /static/ and /media/ directly, proxy the rest to Gunicorn.
```

---

## 🔧 Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `DJANGO_SECRET_KEY` | (insecure default) | Session/csrf signing key. **Set in production.** |
| `DJANGO_DEBUG` | `True` | Must be `False` in production. |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1,0.0.0.0` | Comma-separated hostnames. Add your domain. |
| `DB_ENGINE` | `django.db.backends.sqlite3` | Use `django.db.backends.postgresql` for Postgres. |
| `DB_NAME` | `db.sqlite3` | DB name or SQLite path. |
| `DB_USER` / `DB_PASSWORD` | — | Postgres credentials. |
| `DB_HOST` / `DB_PORT` | — | DB host/port. |
| `CORS_ALLOWED_ORIGINS` | — | Comma-separated list of extra origins (e.g. `https://yourdomain.com`). |
| `SECURE_SSL_REDIRECT` | `True` when DEBUG=False | Redirect HTTP → HTTPS. |
| `GUNICORN_WORKERS` | `2` (Docker) | Gunicorn worker count. |
| `PORT` | `8000` | Port gunicorn binds to (Render/Railway set this automatically). |
| `SEED_SAMPLE_DATA` | `false` | Run `seed_sample` management command on boot. |
| `DJANGO_SUPERUSER_USERNAME` / `EMAIL` / `PASSWORD` | — | Auto-creates a superuser on first boot if set. |
| `FRONTEND_DIST_DIR` | `backend/static/frontend` | Location of built React assets (advanced). |

---

## ✅ Post-deploy checklist

- [ ] Visit `/admin/` and log in with the superuser credentials you set.
- [ ] Edit your **Profile** (or delete sample projects/posts and add your real ones).
- [ ] Change the superuser password if Render/Railway generated one for you.
- [ ] Add a custom domain in Render/Railway dashboard + add it to `DJANGO_ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.
- [ ] Revoke any test PATs you shared during setup.
- [ ] Upload your own profile picture / project thumbnails / blog cover images via `/admin/`.

Enjoy your live portfolio! 🎉
