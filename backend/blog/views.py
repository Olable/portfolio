from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count
from .models import Category, Tag, Post, Comment
from .serializers import (
    CategorySerializer, TagSerializer,
    PostListSerializer, PostDetailSerializer,
    PostCreateUpdateSerializer, CommentCreateSerializer
)


# ---------- Public ----------
class PostListView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Post.objects.filter(status='published').select_related('author', 'category').prefetch_related('tags')
        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        tag = self.request.query_params.get('tag')
        featured = self.request.query_params.get('featured')
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(excerpt__icontains=search)
            )
        if category:
            qs = qs.filter(category__slug=category)
        if tag:
            qs = qs.filter(tags__slug=tag)
        if featured == 'true':
            qs = qs.filter(is_featured=True)
        return qs.distinct()


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Post.objects.filter(status='published').select_related(
        'author', 'category'
    ).prefetch_related('tags', 'comments')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        Post.objects.filter(pk=instance.pk).update(views=instance.views)
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)


class CommentCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, slug):
        try:
            post = Post.objects.get(slug=slug, status='published')
        except Post.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(post=post)
        return Response(
            {'detail': 'Comment submitted and awaiting approval.'},
            status=status.HTTP_201_CREATED
        )


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status='published'))
    ).order_by('name')


class TagListView(generics.ListAPIView):
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Tag.objects.all().order_by('name')


# ---------- Staff / Admin API for writing posts ----------
class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class AdminPostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaff]
    serializer_class = PostCreateUpdateSerializer

    def get_queryset(self):
        return Post.objects.all().select_related('author').prefetch_related('tags')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PostListSerializer
        return PostCreateUpdateSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AdminPostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaff]
    serializer_class = PostCreateUpdateSerializer
    lookup_field = 'slug'
    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PostDetailSerializer
        return PostCreateUpdateSerializer
