from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import Business, UserRole

User = get_user_model()


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'business']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'role']
        read_only_fields = ['id']

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value.strip()

    def validate_email(self, value):
        normalized_email = value.strip()
        if normalized_email and User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized_email

    def create(self, validated_data):
        business = self.context['business']
        password = validated_data.pop('password')
        user = User(**validated_data, business=business)
        user.set_password(password)
        user.save()
        return user


class BusinessAdminSignupSerializer(serializers.Serializer):
    business_name = serializers.CharField(max_length=255)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_business_name(self, value):
        if Business.objects.filter(name__iexact=value.strip()).exists():
            raise serializers.ValidationError('Business name already exists.')
        return value.strip()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value.strip()

    def validate_email(self, value):
        normalized_email = value.strip()
        if normalized_email and User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized_email

    @transaction.atomic
    def create(self, validated_data):
        business = Business.objects.create(name=validated_data['business_name'])
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=UserRole.ADMIN,
            business=business,
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
