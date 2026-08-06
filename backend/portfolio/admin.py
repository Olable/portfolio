from django.contrib import admin
from .models import (
    Profile, SkillCategory, Skill, Project,
    Experience, Education, ContactMessage
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'title', 'location', 'updated_at')


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'level', 'order')
    list_filter = ('category',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_featured', 'order', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('is_featured',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'start_date', 'end_date', 'current')


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('school', 'degree', 'field', 'start_date', 'end_date')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
