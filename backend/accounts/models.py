from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, default="")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    github = models.URLField(blank=True, default="")
    linkedin = models.URLField(blank=True, default="")
    twitter = models.URLField(blank=True, default="")
    website = models.URLField(blank=True, default="")

    def __str__(self):
        return self.username
