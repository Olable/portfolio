from rest_framework import serializers
from .models import Category, Tag, Post, Comment


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'post_count')

    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'slug')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'name', 'body', 'created_at')
        read_only_fields = ('id', 'created_at')


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('name', 'email', 'body')


class PostListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True, default=None)
    category_slug = serializers.CharField(source='category.slug', read_only=True, default=None)
    tags = TagSerializer(many=True, read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    reading_time = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = (
            'id', 'title', 'slug', 'excerpt', 'cover_image', 'cover_image_url',
            'author_name', 'author_username', 'category_name', 'category_slug',
            'tags', 'is_featured', 'views', 'reading_time',
            'published_at', 'created_at'
        )

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class PostDetailSerializer(PostListSerializer):
    content = serializers.CharField()
    comments = serializers.SerializerMethodField()

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ('content', 'comments')

    def get_comments(self, obj):
        qs = obj.comments.filter(is_approved=True)
        return CommentSerializer(qs, many=True).data


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50), write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = (
            'title', 'slug', 'category', 'tags', 'excerpt', 'content',
            'cover_image', 'status', 'is_featured', 'published_at'
        )

    def _set_tags(self, instance, tag_names):
        instance.tags.clear()
        for name in tag_names or []:
            name = name.strip().lower()
            if name:
                tag, _ = Tag.objects.get_or_create(name=name.title(), slug=name.replace(' ', '-'))
                instance.tags.add(tag)

    def create(self, validated_data):
        tag_names = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        self._set_tags(post, tag_names)
        return post

    def update(self, instance, validated_data):
        tag_names = validated_data.pop('tags', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if tag_names is not None:
            self._set_tags(instance, tag_names)
        return instance
