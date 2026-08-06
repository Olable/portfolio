"""
Serve the React SPA's index.html for any non-API route.
Used in production so React Router handles client-side routing.
"""
from pathlib import Path
from django.http import FileResponse, Http404
from django.conf import settings
from whitenoise.middleware import WhiteNoiseMiddleware


def _index_path():
    # Prefer the copied dist under static/frontend (collected by collectstatic in Docker)
    candidates = [
        settings.BASE_DIR / 'staticfiles' / 'frontend' / 'index.html',
        settings.BASE_DIR / 'static' / 'frontend' / 'index.html',
        Path('/app/frontend-dist/index.html'),  # Docker build stage output
    ]
    # Also check a FRONTEND_DIST_DIR env var
    fd = getattr(settings, 'FRONTEND_DIST_DIR', None)
    if fd:
        candidates.insert(0, Path(fd) / 'index.html')
    for p in candidates:
        if p.exists():
            return p
    return None


def serve_react(request, path=None):
    """
    Catch-all view that returns the React index.html so React Router can handle
    the path on the client.
    """
    # Don't intercept API/admin/media/static
    if request.path_info.startswith(('/api/', '/admin/', '/media/', '/static/')):
        raise Http404
    index = _index_path()
    if not index:
        raise Http404("Frontend build not found. Run `npm run build` in frontend/.")
    return FileResponse(open(index, 'rb'), content_type='text/html')
