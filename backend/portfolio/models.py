from django.db import models
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=120)
    title = models.CharField(max_length=200, help_text="e.g. Full-Stack Developer")
    tagline = models.CharField(max_length=255, blank=True)
    about = models.TextField()
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    location = models.CharField(max_length=120, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class SkillCategory(models.Model):
    name = models.CharField(max_length=80)

    class Meta:
        verbose_name_plural = "Skill categories"

    def __str__(self):
        return self.name


class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    level = models.IntegerField(default=75, help_text="0-100")
    icon = models.CharField(max_length=80, blank=True, help_text="Icon name or emoji")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    summary = models.CharField(max_length=280)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='projects/', blank=True, null=True)
    live_url = models.URLField(blank=True)
    repo_url = models.URLField(blank=True)
    technologies = models.CharField(max_length=255, help_text="Comma-separated list")
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    @property
    def tech_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]


class Experience(models.Model):
    company = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False)
    location = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.role} @ {self.company}"


class Education(models.Model):
    school = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Education"
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.degree} — {self.school}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.subject} — {self.name}"
