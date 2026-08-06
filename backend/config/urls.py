from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from .spa import serve_react


def api_root(request):
    return JsonResponse({
        'name': 'Olable Portfolio + Blog API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/',
            'portfolio': '/api/portfolio/',
            'blog': '/api/blog/',
            'admin': '/admin/',
        }
    })


urlpatterns = [
    path('api/', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/blog/', include('blog.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# In production (DEBUG=False), serve the React SPA at the root for all
# non-API paths. In development Vite handles "/" itself, so this only
# activates when the frontend is built and served by Django.
if not settings.DEBUG or (settings.FRONTEND_DIST_DIR and Path(str(settings.FRONTEND_DIST_DIR)).exists()):
    from pathlib import Path
    if Path(str(settings.FRONTEND_DIST_DIR)).exists():
        urlpatterns += [
            # Serve root index.html
            path('', serve_react, name='react-root', kwargs={'path': ''}),
            # Serve any nested client-side route
            re_path(r'^(?P<path>(?!api/|admin/|media/|static/).*)$', serve_react, name='react-routes'),
        ]
