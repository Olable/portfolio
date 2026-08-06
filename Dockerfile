# ============================================================
# Stage 1: Build the React frontend
# ============================================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
# Build production bundle -> /app/frontend/dist
RUN npm run build

# ============================================================
# Stage 2: Build the Django backend + serve everything
# ============================================================
FROM python:3.12-slim AS production

# System deps for psycopg2 + health checks
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings \
    DJANGO_DEBUG=False \
    PORT=8000

WORKDIR /app/backend

# Install Python deps
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy the built frontend into the backend so WhiteNoise can serve it
COPY --from=frontend-build /app/frontend/dist /app/frontend-dist

# Create a directory where collectstatic will place everything
# and add a small script to copy the frontend build into staticfiles/
RUN mkdir -p staticfiles media static/frontend

# Copy entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh && \
    mkdir -p /app/backend/static/frontend /app/backend/media /app/backend/staticfiles && \
    cp -r /app/frontend-dist/* /app/backend/static/frontend/ 2>/dev/null || true

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
