# Portfolio & Blog — Django REST API + React

A personal portfolio and blog application built with a Django REST Framework backend and a React (Vite + Tailwind CSS) frontend, deployable via Docker.

**Stack:** Django 5 · Django REST Framework · SimpleJWT · React 18 · Vite · Tailwind CSS · Docker
SQLite in development, PostgreSQL in production.

---

## What it does

**Portfolio**
- Projects showcase with tech tags and repo/live links
- Skills, experience and education sections
- Contact form that persists messages to the database and exposes them in Django admin

**Blog**
- Posts with categories and tags
- Search and filtering
- Comment system with moderation
- View counter and reading-time estimate

**Accounts**
- Registration and login using JWT (`djangorestframework-simplejwt`)
- Protected admin dashboard route in the React app

---

## Architecture

```
backend/
  config/       Django project settings, URLs, SPA serving
  accounts/     Custom user model, JWT auth endpoints
  blog/         Post, Category, Tag, Comment models + API
  portfolio/    Project, Skill, Experience models + API
                management/commands/seed_sample.py — demo data seeder
frontend/
  src/pages/       Home, About, Projects, BlogList, BlogPost,
                   Contact, Login, Register, AdminDashboard, NotFound
  src/components/  Navbar, Footer, Hero, ProjectCard, BlogCard, Loading
Dockerfile, Procfile, render.yaml, railway.json
```

The Django backend exposes a REST API and also serves the built React bundle in production (`config/spa.py`), so the whole app deploys as a single service.

---

## Running locally

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_sample      # optional: load demo content
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8000`, frontend dev server on `http://localhost:5173`.

**Docker**
```bash
docker build -t portfolio .
docker run -p 8000:8000 --env-file backend/.env portfolio
```

---

## Configuration

Copy `backend/.env.example` to `backend/.env` and set:

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key |
| `DJANGO_DEBUG` | `True` locally, `False` in production |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hostnames |
| `DB_ENGINE` | Database backend (defaults to SQLite) |
| `DB_NAME` | Database name or path |
| `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | PostgreSQL connection details (unused with SQLite) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |

---

## Deployment

Deployment configs are included for Render (`render.yaml`) and Railway (`railway.json`). Static files are served with WhiteNoise; `gunicorn` is the production server. See [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Status and roadmap

Working application. Currently in progress:

- [ ] Test suite — `tests.py` files are still Django stubs
- [ ] Live deployment URL
- [ ] CI via GitHub Actions
- [ ] API documentation (drf-spectacular)

---

## Author

**Akeem Olayemi Yekeen** — Lagos, Nigeria
[GitHub](https://github.com/Olable) · [LinkedIn](https://www.linkedin.com/in/olayemi-akeem-1140b31b1)

Backend developer with 12 years in accounting and ERP systems (Microsoft Dynamics NAV, Sage Accpac).
