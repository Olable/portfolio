from django.urls import path
from . import views

urlpatterns = [
    # public
    path('posts/', views.PostListView.as_view(), name='blog-posts'),
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='blog-post-detail'),
    path('posts/<slug:slug>/comment/', views.CommentCreateView.as_view(), name='blog-post-comment'),
    path('categories/', views.CategoryListView.as_view(), name='blog-categories'),
    path('tags/', views.TagListView.as_view(), name='blog-tags'),
    # admin
    path('admin/posts/', views.AdminPostListCreateView.as_view(), name='blog-admin-posts'),
    path('admin/posts/<slug:slug>/', views.AdminPostRetrieveUpdateDestroyView.as_view(), name='blog-admin-post'),
]
