# Olable · Portfolio & Blog

A modern personal portfolio + blog built with **Django** (REST API) and **React** (frontend with Vite + Tailwind CSS).

![stack](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) ![DRF](https://img.shields.io/badge/DRF-red?style=flat) ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=flat)

## ✨ Features

### Portfolio
- Hero section with animated gradient blobs
- About / Bio
- Skills by category with progress bars
- Projects showcase (featured, tech tags, repo/live links)
- Experience & Education timelines
- Contact form (messages saved to DB, viewable in admin)
- Social links

### Blog
- Markdown-powered posts (full GFM support)
- Categories & tags
- Featured posts
- Search & filter
- Comment system (moderated/approved)
- Reading-time estimate + view counter
- Pagination / Load more
- Admin dashboard (React) + Django admin

### Auth
- JWT authentication (access + refresh tokens)
- Register / Login / Logout
- Profile update endpoint
- Staff-only write APIs

## 🗂 Project Structure

```
olble-portfolio/
├── backend/
│   ├── config/          # Django project settings & root URLconf
│   ├── accounts/        # Custom user + JWT auth
│   ├── portfolio/       # Profile, Projects, Skills, Experience, Contact
│   ├── blog/            # Posts, Categories, Tags, Comments
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, Cards, Hero, etc.
    │   ├── pages/       # Home, About, Projects, Blog, Contact, Admin...
    │   ├── context/     # AuthContext, ThemeContext
    │   ├── api/         # Axios client + API helpers
    │   └── utils/
    ├── index.html
    ├── vite.config.js   # Dev proxy to Django on :8000
    └── tailwind.config.js
```

## 🚀 Quick Start

### 1. Backend (Django)

```bash
cd backend
python -m venv ../venv
source ../venv/bin/activate    # Windows: ..\venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Copy env example and set a secret key
cp .env.example .env

python manage.py migrate
python manage.py seed_sample     # seeds demo content + admin user
python manage.py runserver
```

The API will be available at http://localhost:8000

**Seed credentials** (created by `seed_sample`):
- Username: `olble`
- Password: `admin123`
- Superuser / staff access

> ⚠️ Change the password before deploying.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — Vite proxies `/api/*`, `/admin`, `/media`, and `/static` to Django automatically.

### Production build

```bash
cd frontend && npm run build   # outputs to frontend/dist
```

Serve `frontend/dist` as static files and run Django with `DEBUG=False` + Whitenoise (already configured) or put it behind Nginx.

## 🔌 API Endpoints

Public:
- `GET  /api/portfolio/` – profile
- `GET  /api/portfolio/projects/` – list projects
- `GET  /api/portfolio/projects/<slug>/` – project detail
- `GET  /api/portfolio/skills/` – skill categories + skills
- `GET  /api/portfolio/experience/`
- `GET  /api/portfolio/education/`
- `POST /api/portfolio/contact/` – contact form
- `GET  /api/blog/posts/` – list posts (supports `?search=`, `?category=`, `?tag=`, `?featured=true`)
- `GET  /api/blog/posts/<slug>/` – single post (Markdown content + approved comments)
- `POST /api/blog/posts/<slug>/comment/` – submit comment (needs approval)
- `GET  /api/blog/categories/` · `/api/blog/tags/`
- `POST /api/auth/register/` · `POST /api/auth/login/` · `POST /api/auth/refresh/`

Staff-only (JWT required):
- `GET/POST  /api/blog/admin/posts/`
- `GET/PATCH/DELETE /api/blog/admin/posts/<slug>/`
- `GET/PATCH /api/portfolio/admin/profile/`
- `GET /api/portfolio/admin/messages/`

Django admin is at `/admin/`.

## 🛠 Deployment Checklist

1. Set `DJANGO_DEBUG=False`
2. Set a strong `DJANGO_SECRET_KEY`
3. Add your domain to `DJANGO_ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
4. Use PostgreSQL (set `DB_ENGINE=django.db.backends.postgresql`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`)
5. `python manage.py collectstatic`
6. Serve with Gunicorn + Nginx, or deploy to Railway/Render/Heroku/Fly.io
7. Build React: `cd frontend && npm run build` and serve `dist/` from Nginx or collect it into Django static.

## 📝 License

MIT — do what you want, but a mention would be awesome! ❤️

Built for [github.com/olble](https://github.com/olble).
