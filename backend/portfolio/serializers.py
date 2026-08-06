from rest_framework import serializers
from .models import (
    Profile, Skill, SkillCategory, Project,
    Experience, Education, ContactMessage
)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'level', 'icon', 'order')


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True)

    class Meta:
        model = SkillCategory
        fields = ('id', 'name', 'skills')


class ProjectSerializer(serializers.ModelSerializer):
    tech_list = serializers.ReadOnlyField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'slug', 'summary', 'description', 'thumbnail',
            'thumbnail_url', 'live_url', 'repo_url', 'technologies',
            'tech_list', 'is_featured', 'order', 'created_at'
        )

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def get_resume_url(self, obj):
        if obj.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
            return obj.resume.url
        return None


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('name', 'email', 'subject', 'message')

    def create(self, validated_data):
        return ContactMessage.objects.create(**validated_data)


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
