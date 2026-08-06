from django.urls import path
from . import views

urlpatterns = [
    # public
    path('', views.ProfileView.as_view(), name='portfolio-profile'),
    path('projects/', views.ProjectListView.as_view(), name='portfolio-projects'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='portfolio-project-detail'),
    path('skills/', views.SkillCategoryListView.as_view(), name='portfolio-skills'),
    path('experience/', views.ExperienceListView.as_view(), name='portfolio-experience'),
    path('education/', views.EducationListView.as_view(), name='portfolio-education'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='portfolio-contact'),
    # admin
    path('admin/profile/', views.AdminProfileView.as_view(), name='portfolio-admin-profile'),
    path('admin/messages/', views.AdminMessageListView.as_view(), name='portfolio-admin-messages'),
]
