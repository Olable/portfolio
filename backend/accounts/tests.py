from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class CustomUserModelTests(APITestCase):
    """The custom user model adds profile fields on top of AbstractUser."""

    def test_create_user_sets_password_and_defaults(self):
        user = User.objects.create_user(
            username='akeem', email='akeem@example.com', password='testpass123'
        )
        self.assertEqual(user.username, 'akeem')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)
        self.assertEqual(user.bio, '')
        self.assertEqual(user.github, '')

    def test_str_returns_username(self):
        user = User.objects.create_user(username='akeem', password='testpass123')
        self.assertEqual(str(user), 'akeem')

    def test_create_superuser_is_staff(self):
        admin = User.objects.create_superuser(
            username='admin', email='admin@example.com', password='adminpass123'
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)


class RegistrationTests(APITestCase):
    def setUp(self):
        self.url = reverse('auth-register')

    def test_register_creates_user(self):
        response = self.client.post(self.url, {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'strongpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_password_is_hashed_not_stored_plaintext(self):
        self.client.post(self.url, {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'strongpass123',
        }, format='json')
        user = User.objects.get(username='newuser')
        self.assertNotEqual(user.password, 'strongpass123')
        self.assertTrue(user.check_password('strongpass123'))

    def test_password_not_returned_in_response(self):
        response = self.client.post(self.url, {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'strongpass123',
        }, format='json')
        self.assertNotIn('password', response.data)

    def test_short_password_rejected(self):
        response = self.client.post(self.url, {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'abc',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_username_rejected(self):
        User.objects.create_user(username='taken', password='testpass123')
        response = self.client.post(self.url, {
            'username': 'taken',
            'email': 'other@example.com',
            'password': 'strongpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def setUp(self):
        self.url = reverse('auth-login')
        self.user = User.objects.create_user(
            username='akeem', email='akeem@example.com', password='testpass123'
        )

    def test_login_returns_access_and_refresh_tokens(self):
        response = self.client.post(self.url, {
            'username': 'akeem', 'password': 'testpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_response_embeds_user_payload(self):
        response = self.client.post(self.url, {
            'username': 'akeem', 'password': 'testpass123',
        }, format='json')
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'akeem')

    def test_wrong_password_rejected(self):
        response = self.client.post(self.url, {
            'username': 'akeem', 'password': 'wrongpassword',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MeEndpointTests(APITestCase):
    def setUp(self):
        self.url = reverse('auth-me')
        self.user = User.objects.create_user(
            username='akeem', email='akeem@example.com', password='testpass123'
        )

    def test_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_gets_own_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'akeem')

    def test_patch_updates_bio(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url, {'bio': 'Django developer'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'Django developer')

    def test_username_is_read_only(self):
        self.client.force_authenticate(user=self.user)
        self.client.patch(self.url, {'username': 'hacker'}, format='json')
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'akeem')
