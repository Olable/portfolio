"""
Seed sample content for portfolio & blog.
Usage: python manage.py seed_sample
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date
from accounts.models import CustomUser
from portfolio.models import (
    Profile, SkillCategory, Skill, Project, Experience, Education
)
from blog.models import Category as BlogCategory, Tag, Post


class Command(BaseCommand):
    help = 'Seeds sample portfolio + blog data'

    def handle(self, *args, **kwargs):
        if CustomUser.objects.filter(username='olble').exists():
            self.stdout.write(self.style.WARNING('Sample data already exists. Skipping.'))
            return

        user = CustomUser.objects.create_superuser(
            username='olble', email='olble@example.com', password='admin123',
            first_name='Olble', last_name=''
        )

        Profile.objects.create(
            user=user,
            full_name='Olble',
            title='Full-Stack Developer & Designer',
            tagline='I build clean, fast, and delightful web experiences.',
            about=(
                "Hi! I'm Olble, a passionate full-stack developer who loves crafting "
                "beautiful, functional web applications. I work primarily with Python/Django "
                "on the backend and React on the frontend, and I care deeply about good UX, "
                "performance, and clean code. When I'm not coding, I'm writing on my blog, "
                "exploring new tech, and sipping good coffee in Lagos, Nigeria."
            ),
            location='Lagos, Nigeria',
            email='olble@example.com',
        )

        # Skills
        frontend = SkillCategory.objects.create(name='Frontend')
        backend = SkillCategory.objects.create(name='Backend')
        tools = SkillCategory.objects.create(name='Tools & Others')

        for i, (name, level, icon) in enumerate([
            ('React', 90, '⚛️'), ('TypeScript', 80, '🟦'),
            ('HTML/CSS', 95, '🎨'), ('Tailwind', 90, '💨'),
        ]):
            Skill.objects.create(category=frontend, name=name, level=level, icon=icon, order=i)
        for i, (name, level, icon) in enumerate([
            ('Django', 92, '🐍'), ('Python', 93, '🐍'),
            ('Node.js', 78, '🟢'), ('PostgreSQL', 80, '🐘'),
        ]):
            Skill.objects.create(category=backend, name=name, level=level, icon=icon, order=i)
        for i, (name, level, icon) in enumerate([
            ('Git', 90, '🔧'), ('Docker', 75, '🐳'),
            ('Figma', 80, '🎯'), ('AWS', 70, '☁️'),
        ]):
            Skill.objects.create(category=tools, name=name, level=level, icon=icon, order=i)

        # Projects
        Project.objects.create(
            title='Portfolio + Blog',
            slug='portfolio-blog',
            summary='This very website — built with Django REST and React.',
            description=(
                'A full-stack personal website featuring a portfolio showcase and a '
                'Markdown-powered blog with categories, tags, comments, and a clean admin.'
            ),
            technologies='Django, Django REST Framework, React, Tailwind CSS, JWT',
            live_url='',
            repo_url='https://github.com/olble',
            is_featured=True, order=1,
        )
        Project.objects.create(
            title='Task Manager Pro',
            slug='task-manager-pro',
            summary='Kanban-style task manager with real-time collaboration.',
            description='A productivity app with drag-and-drop boards, real-time updates via WebSockets, and team workspaces.',
            technologies='Django Channels, React, Redis, PostgreSQL',
            live_url='', repo_url='https://github.com/olble',
            is_featured=True, order=2,
        )
        Project.objects.create(
            title='E-commerce Storefront',
            slug='ecommerce-storefront',
            summary='Modern storefront with Stripe checkout and admin dashboard.',
            description='An e-commerce platform featuring product catalog, cart, Stripe payments, order tracking and admin analytics.',
            technologies='Django, React, Stripe, Tailwind',
            live_url='', repo_url='https://github.com/olble',
            is_featured=True, order=3,
        )

        # Experience
        Experience.objects.create(
            company='Freelance', role='Full-Stack Developer',
            description='Building web apps and APIs for clients globally.',
            start_date=date(2023, 1, 1), current=True,
            location='Lagos, Nigeria',
        )

        # Education
        Education.objects.create(
            school='Self-taught / Online', degree='BSc in Computer Science (or equivalent)',
            field='Software Engineering',
            start_date=date(2020, 1, 1), end_date=date(2024, 12, 31),
            description='Continuous learning through projects, courses, and open source.',
        )

        # Blog categories & posts
        cat_dev = BlogCategory.objects.create(name='Development', slug='development')
        cat_design = BlogCategory.objects.create(name='Design', slug='design')
        cat_life = BlogCategory.objects.create(name='Life', slug='life')

        t_django = Tag.objects.create(name='Django', slug='django')
        t_react = Tag.objects.create(name='React', slug='react')
        t_tips = Tag.objects.create(name='Tips', slug='tips')

        p1 = Post.objects.create(
            title='Hello, World — Welcome to my blog!',
            slug='hello-world',
            author=user, category=cat_life,
            excerpt='A short intro post about why I started this blog and what you can expect.',
            content=(
                "# Hello, World!\n\n"
                "Welcome to my corner of the internet. I'll be writing about software development, "
                "design, productivity, and life as a developer.\n\n"
                "This site itself is built with **Django** and **React** — I'll write more about "
                "the stack in upcoming posts.\n\n"
                "Stay tuned!"
            ),
            status='published', is_featured=True, published_at=timezone.now(),
        )
        p1.tags.add(t_django, t_react)

        p2 = Post.objects.create(
            title='Why Django + React is my go-to stack in 2025',
            slug='why-django-react-2025',
            author=user, category=cat_dev,
            excerpt='A pragmatic look at why Django REST + React remains a powerful combo.',
            content=(
                "# Why Django + React in 2025\n\n"
                "The JS ecosystem moves fast, but some things just work. "
                "Django gives me a rock-solid, batteries-included backend with an amazing ORM, "
                "admin panel, and security out of the box. React gives me the flexibility to "
                "build rich, interactive UIs.\n\n"
                "## What I love\n\n"
                "- DRF serializers make API design a joy\n"
                "- React + hooks + modern tooling (Vite) is fast\n"
                "- Authentication, permissions, and admin are solved\n\n"
                "## Trade-offs\n\n"
                "You maintain two apps. For many solo projects that's fine; for very small "
                "sites, a single framework can be faster.\n"
            ),
            status='published', is_featured=True, published_at=timezone.now(),
        )
        p2.tags.add(t_django, t_react, t_tips)

        p3 = Post.objects.create(
            title='5 clean-code habits that changed how I write Python',
            slug='clean-code-python',
            author=user, category=cat_dev,
            excerpt='Small habits, big impact — type hints, naming, small functions, and more.',
            content=(
                "# 5 Clean-Code Habits for Python\n\n"
                "1. Use type hints everywhere\n"
                "2. Name things for what they *mean*, not what they *are*\n"
                "3. Keep functions small and single-purpose\n"
                "4. Prefer composition over deep inheritance\n"
                "5. Write tests for the tricky parts first\n"
            ),
            status='published', is_featured=False, published_at=timezone.now(),
        )
        p3.tags.add(t_django, t_tips)

        self.stdout.write(self.style.SUCCESS(
            'Seeded sample data. Login with username `olble` / password `admin123`.'
        ))
