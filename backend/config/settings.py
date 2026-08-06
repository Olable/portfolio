"""
Django settings for Olble Portfolio + Blog.
"""
from pathlib import Path
import os
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-change-me-in-production-7b3f9a1c2e4d6f8a0b1c2d3e4f5a6b7c'
)
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'

_default_hosts = 'localhost,127.0.0.1,0.0.0.0'
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', _default_hosts).split(',')
# Allow e2b preview host + Render/Railway preview domains automatically
allowed_env = os.environ.get('DJANGO_ALLOWED_HOSTS', '')
if DEBUG and '*' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append('.onrender.com')
    ALLOWED_HOSTS.append('.up.railway.app')
    ALLOWED_HOSTS.append('.e2b.app')
    # For convenience in Docker/dev
    if os.environ.get('DJANGO_ALLOW_ALL_HOSTS', 'True') == 'True':
        ALLOWED_HOSTS.append('*')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # local
    'portfolio',
    'blog',
    'accounts',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.environ.get('DB_NAME', str(BASE_DIR / 'db.sqlite3')),
        'USER': os.environ.get('DB_USER', ''),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', ''),
        'PORT': os.environ.get('DB_PORT', ''),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Lagos'
USE_I18N = True
USE_TZ = True

# Static / media
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# The React build output is copied into static/frontend during Docker build
# AND can be placed there manually for production.
FRONTEND_DIST_DIR = Path(os.environ.get(
    'FRONTEND_DIST_DIR',
    str(BASE_DIR / 'static' / 'frontend')
))

STATICFILES_DIRS = []
if (BASE_DIR / 'static').exists():
    STATICFILES_DIRS.append(str(BASE_DIR / 'static'))

# WhiteNoise with SPA index support
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
WHITENOISE_INDEX_FILE = True
WHITENOISE_ROOT = str(FRONTEND_DIST_DIR)

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'accounts.CustomUser'

# REST framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 9,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/min',
        'user': '1000/min',
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# CORS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

extra_origins = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if extra_origins:
    for o in extra_origins.split(','):
        o = o.strip()
        if o:
            CORS_ALLOWED_ORIGINS.append(o)
            CSRF_TRUSTED_ORIGINS.append(o)

# Auto-allow common deployment preview domains + dev sandboxes
_cors_regexes = [
    r"^https://.*\.onrender\.com$",
    r"^https://.*\.up\.railway\.app$",
    r"^https://.*\.railway\.app$",
    r"^https://.*\.vercel\.app$",
    r"^https://.*\.netlify\.app$",
]
if DEBUG:
    _cors_regexes.append(r"^https?://.*\.e2b\.app$")
    _cors_regexes.append(r"^http://localhost:\d+$")
    _cors_regexes.append(r"^http://127\.0\.0\.1:\d+$")
CORS_ALLOWED_ORIGIN_REGEXES = _cors_regexes

# Auto-add platform preview origins to CSRF trusted
for _host in ['.onrender.com', '.up.railway.app', '.railway.app', '.vercel.app', '.netlify.app']:
    CSRF_TRUSTED_ORIGINS.append(f'https://*{_host}')
if DEBUG:
    CSRF_TRUSTED_ORIGINS.append('https://*.e2b.app')

# Production hardening (HTTPS)
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True') != 'False'
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
