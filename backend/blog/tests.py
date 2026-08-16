from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Comment, Post, Tag

User = get_user_model()


class SlugGenerationTests(APITestCase):
    """Category and Tag auto-generate slugs on save."""

    def test_category_slug_generated_from_name(self):
        category = Category.objects.create(name='Web Development')
        self.assertEqual(category.slug, 'web-development')

    def test_tag_slug_generated_from_name(self):
        tag = Tag.objects.create(name='Django REST')
        self.assertEqual(tag.slug, 'django-rest')

    def test_explicit_slug_is_not_overwritten(self):
        category = Category.objects.create(name='Web Development', slug='webdev')
        self.assertEqual(category.slug, 'webdev')


class PostModelTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='author', password='testpass123')

    def test_reading_time_rounds_to_nearest_minute(self):
        post = Post.objects.create(
            title='Long Post', slug='long-post', author=self.user,
            content=' '.join(['word'] * 400),
        )
        self.assertEqual(post.reading_time, 2)

    def test_reading_time_minimum_is_one_minute(self):
        post = Post.objects.create(
            title='Short', slug='short', author=self.user, content='Just a few words.',
        )
        self.assertEqual(post.reading_time, 1)

    def test_post_defaults_to_draft_with_zero_views(self):
        post = Post.objects.create(
            title='Draft Post', slug='draft-post', author=self.user, content='Body',
        )
        self.assertEqual(post.status, 'draft')
        self.assertEqual(post.views, 0)
        self.assertFalse(post.is_featured)


class PostListEndpointTests(APITestCase):
    def setUp(self):
        self.url = reverse('blog-posts')
        self.user = User.objects.create_user(username='author', password='testpass123')
        self.category = Category.objects.create(name='Django')
        self.published = Post.objects.create(
            title='Published Post', slug='published-post', author=self.user,
            category=self.category, content='Django content here', status='published',
        )
        self.draft = Post.objects.create(
            title='Draft Post', slug='draft-post', author=self.user,
            content='Not ready', status='draft',
        )

    def _results(self, response):
        data = response.data
        return data['results'] if isinstance(data, dict) and 'results' in data else data

    def test_list_is_public(self):
        self.assertEqual(self.client.get(self.url).status_code, status.HTTP_200_OK)

    def test_drafts_are_excluded_from_public_list(self):
        results = self._results(self.client.get(self.url))
        slugs = [p['slug'] for p in results]
        self.assertIn('published-post', slugs)
        self.assertNotIn('draft-post', slugs)

    def test_search_filters_by_title(self):
        results = self._results(self.client.get(self.url, {'search': 'Published'}))
        self.assertEqual(len(results), 1)

    def test_search_with_no_match_returns_empty(self):
        results = self._results(self.client.get(self.url, {'search': 'nonexistent'}))
        self.assertEqual(len(results), 0)

    def test_filter_by_category_slug(self):
        results = self._results(self.client.get(self.url, {'category': 'django'}))
        self.assertEqual(len(results), 1)


class PostDetailEndpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='author', password='testpass123')
        self.post = Post.objects.create(
            title='Published Post', slug='published-post', author=self.user,
            content='Body text', status='published',
        )
        self.url = reverse('blog-post-detail', kwargs={'slug': 'published-post'})

    def test_retrieve_published_post(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Published Post')

    def test_view_counter_increments_on_retrieve(self):
        self.client.get(self.url)
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, 1)

    def test_draft_post_returns_404(self):
        Post.objects.create(
            title='Hidden', slug='hidden', author=self.user,
            content='Body', status='draft',
        )
        response = self.client.get(reverse('blog-post-detail', kwargs={'slug': 'hidden'}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_only_approved_comments_are_returned(self):
        Comment.objects.create(
            post=self.post, name='Approved', email='a@example.com',
            body='Visible', is_approved=True,
        )
        Comment.objects.create(
            post=self.post, name='Pending', email='b@example.com',
            body='Hidden', is_approved=False,
        )
        response = self.client.get(self.url)
        names = [c['name'] for c in response.data['comments']]
        self.assertEqual(names, ['Approved'])


class CommentSubmissionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='author', password='testpass123')
        self.post = Post.objects.create(
            title='Published Post', slug='published-post', author=self.user,
            content='Body', status='published',
        )
        self.url = reverse('blog-post-comment', kwargs={'slug': 'published-post'})

    def test_anyone_can_submit_a_comment(self):
        response = self.client.post(self.url, {
            'name': 'Reader', 'email': 'reader@example.com', 'body': 'Great post!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_new_comment_requires_moderation(self):
        self.client.post(self.url, {
            'name': 'Reader', 'email': 'reader@example.com', 'body': 'Great post!',
        }, format='json')
        self.assertFalse(Comment.objects.get(name='Reader').is_approved)

    def test_invalid_email_rejected(self):
        response = self.client.post(self.url, {
            'name': 'Reader', 'email': 'not-an-email', 'body': 'Great post!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_comment_on_missing_post_returns_404(self):
        response = self.client.post(
            reverse('blog-post-comment', kwargs={'slug': 'does-not-exist'}),
            {'name': 'Reader', 'email': 'r@example.com', 'body': 'Hi'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AdminPostEndpointTests(APITestCase):
    """Write endpoints are restricted to staff users."""

    def setUp(self):
        self.url = reverse('blog-admin-posts')
        self.author = User.objects.create_user(username='author', password='testpass123')
        self.staff = User.objects.create_user(
            username='staff', password='testpass123', is_staff=True
        )

    def test_anonymous_cannot_list_admin_posts(self):
        self.assertEqual(self.client.get(self.url).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_user_is_forbidden(self):
        self.client.force_authenticate(user=self.author)
        self.assertEqual(self.client.get(self.url).status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_list_including_drafts(self):
        Post.objects.create(
            title='Draft', slug='draft', author=self.author,
            content='Body', status='draft',
        )
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_staff_can_create_post_and_is_recorded_as_author(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.post(self.url, {
            'title': 'New Post', 'slug': 'new-post',
            'content': 'Body', 'status': 'published',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.get(slug='new-post').author, self.staff)

    def test_creating_post_with_tags_creates_tag_records(self):
        self.client.force_authenticate(user=self.staff)
        self.client.post(self.url, {
            'title': 'Tagged Post', 'slug': 'tagged-post', 'content': 'Body',
            'status': 'published', 'tags': ['django', 'testing'],
        }, format='json')
        self.assertEqual(Post.objects.get(slug='tagged-post').tags.count(), 2)
