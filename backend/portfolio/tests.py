from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    ContactMessage, Education, Experience, Profile,
    Project, Skill, SkillCategory,
)

User = get_user_model()


class ProjectModelTests(APITestCase):
    def test_tech_list_splits_and_strips_comma_separated_field(self):
        project = Project.objects.create(
            title='Portfolio', slug='portfolio', summary='A portfolio',
            description='Full description', technologies='Django, React ,  Docker',
        )
        self.assertEqual(project.tech_list, ['Django', 'React', 'Docker'])

    def test_tech_list_ignores_empty_entries(self):
        project = Project.objects.create(
            title='Portfolio', slug='portfolio', summary='A portfolio',
            description='Full description', technologies='Django,,React,',
        )
        self.assertEqual(project.tech_list, ['Django', 'React'])

    def test_projects_ordered_by_order_field(self):
        Project.objects.create(
            title='Second', slug='second', summary='s',
            description='d', technologies='Django', order=2,
        )
        Project.objects.create(
            title='First', slug='first', summary='s',
            description='d', technologies='React', order=1,
        )
        self.assertEqual(
            [p.title for p in Project.objects.all()], ['First', 'Second']
        )


class ExperienceModelTests(APITestCase):
    def test_str_combines_role_and_company(self):
        experience = Experience.objects.create(
            company='DeltaAfrik Engineering', role='Cost Accountant',
            description='Job costing', start_date=date(2011, 1, 1),
        )
        self.assertEqual(str(experience), 'Cost Accountant @ DeltaAfrik Engineering')

    def test_experiences_ordered_most_recent_first(self):
        Experience.objects.create(
            company='Older Co', role='Analyst', description='d',
            start_date=date(2008, 1, 1),
        )
        Experience.objects.create(
            company='Newer Co', role='Developer', description='d',
            start_date=date(2020, 1, 1),
        )
        self.assertEqual(Experience.objects.first().company, 'Newer Co')


class PublicEndpointTests(APITestCase):
    """All public portfolio endpoints are readable without authentication."""

    def setUp(self):
        self.user = User.objects.create_user(username='owner', password='testpass123')

    def test_projects_list_is_public(self):
        Project.objects.create(
            title='Portfolio', slug='portfolio', summary='s',
            description='d', technologies='Django',
        )
        response = self.client.get(reverse('portfolio-projects'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_project_detail_by_slug(self):
        Project.objects.create(
            title='Portfolio', slug='portfolio', summary='s',
            description='d', technologies='Django',
        )
        response = self.client.get(
            reverse('portfolio-project-detail', kwargs={'slug': 'portfolio'})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Portfolio')

    def test_missing_project_returns_404(self):
        response = self.client.get(
            reverse('portfolio-project-detail', kwargs={'slug': 'nope'})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_skills_endpoint_nests_skills_under_category(self):
        category = SkillCategory.objects.create(name='Backend')
        Skill.objects.create(category=category, name='Django', level=80)
        response = self.client.get(reverse('portfolio-skills'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results[0]['skills']), 1)

    def test_experience_endpoint_is_public(self):
        Experience.objects.create(
            company='DeltaAfrik', role='Cost Accountant',
            description='d', start_date=date(2011, 1, 1),
        )
        self.assertEqual(
            self.client.get(reverse('portfolio-experience')).status_code,
            status.HTTP_200_OK,
        )

    def test_education_endpoint_is_public(self):
        Education.objects.create(
            school='ICAN', degree='AAT', start_date=date(2015, 1, 1),
        )
        self.assertEqual(
            self.client.get(reverse('portfolio-education')).status_code,
            status.HTTP_200_OK,
        )


class ContactFormTests(APITestCase):
    def setUp(self):
        self.url = reverse('portfolio-contact')

    def test_anyone_can_submit_contact_message(self):
        response = self.client.post(self.url, {
            'name': 'Recruiter', 'email': 'recruiter@example.com',
            'subject': 'Job opportunity', 'message': 'We would like to talk.',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_message_is_persisted_to_database(self):
        self.client.post(self.url, {
            'name': 'Recruiter', 'email': 'recruiter@example.com',
            'subject': 'Job opportunity', 'message': 'We would like to talk.',
        }, format='json')
        message = ContactMessage.objects.get(email='recruiter@example.com')
        self.assertEqual(message.subject, 'Job opportunity')
        self.assertFalse(message.is_read)

    def test_invalid_email_rejected(self):
        response = self.client.post(self.url, {
            'name': 'Recruiter', 'email': 'not-an-email',
            'subject': 'Hi', 'message': 'Hello',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_missing_required_fields_rejected(self):
        response = self.client.post(self.url, {'name': 'Recruiter'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminEndpointPermissionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='regular', password='testpass123')
        self.staff = User.objects.create_user(
            username='staff', password='testpass123', is_staff=True
        )

    def test_anonymous_cannot_read_contact_messages(self):
        response = self.client.get(reverse('portfolio-admin-messages'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cannot_read_contact_messages(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('portfolio-admin-messages'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_read_contact_messages(self):
        ContactMessage.objects.create(
            name='Recruiter', email='r@example.com',
            subject='Hi', message='Hello',
        )
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse('portfolio-admin-messages'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_profile_requires_staff(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('portfolio-admin-profile'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_retrieve_admin_profile(self):
        """Regression test: get_object() referenced an undefined `request`."""
        Profile.objects.create(
            user=self.staff, full_name='Akeem Yekeen',
            title='Backend Developer', about='About me',
        )
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse('portfolio-admin-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SeedCommandTests(APITestCase):
    def test_seed_sample_populates_demo_content(self):
        from django.core.management import call_command
        from io import StringIO

        call_command('seed_sample', stdout=StringIO())
        self.assertTrue(Project.objects.exists())
