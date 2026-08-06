from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    Profile, Project, SkillCategory,
    Experience, Education, ContactMessage
)
from .serializers import (
    ProfileSerializer, ProjectSerializer, SkillCategorySerializer,
    ExperienceSerializer, EducationSerializer, ContactMessageSerializer,
    ContactMessageAdminSerializer
)


# ---------- Public ----------
class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return Profile.objects.first()


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Project.objects.all()


class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Project.objects.all()
    lookup_field = 'slug'


class SkillCategoryListView(generics.ListAPIView):
    serializer_class = SkillCategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = SkillCategory.objects.prefetch_related('skills').order_by('name')


class ExperienceListView(generics.ListAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Experience.objects.all()


class EducationListView(generics.ListAPIView):
    serializer_class = EducationSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Education.objects.all()


class ContactMessageCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ---------- Admin / Staff only ----------
class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class AdminProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsStaff]

    def get_object(self):
        prof, _ = Profile.objects.get_or_create(
            id=1, defaults={
                'user': request.user,
                'full_name': request.user.get_full_name() or request.user.username,
                'title': 'Full-Stack Developer',
                'about': 'Edit me via admin.',
            }
        )
        return prof


class AdminMessageListView(generics.ListAPIView):
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsStaff]
    queryset = ContactMessage.objects.all()
