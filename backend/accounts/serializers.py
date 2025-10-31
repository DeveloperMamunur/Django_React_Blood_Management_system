from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import ReceiverProfile, HospitalProfile, AdminProfile
from locations.models import Location
from locations.serializers import LocationSerializer
from analytics.models import ActivityLog
from django.utils import timezone
import os

User = get_user_model()


# -----------------------------
# Register Serializer
# -----------------------------
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email',  'password', 'password2', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        request = self.context.get('request')
        ip = None
        user_agent = ''
        if request:
            ip = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')

        ActivityLog.objects.create(
            user=user,
            action='USER_REGISTERED',
            description=f"New user '{user.username}' registered with role '{user.role}'.",
            ip_address=ip,
            user_agent=user_agent,
            metadata={
                "email": user.email,
                "role": user.role,
                "timestamp": timezone.now().isoformat()
            }
        )
        return user

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# -----------------------------
# JWT Login Serializer
# -----------------------------
class UserLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        return token


# -----------------------------
# Password Change Serializer
# -----------------------------
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone_number', 'is_active_account', 'email_verified',
            'created_at', 'updated_at',
        ]


# -----------------------------
# Admin Profile Serializer
# -----------------------------
class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = AdminProfile
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        location_data = validated_data.pop('location', None)
        location = None
        if location_data:
            location = Location.objects.create(**location_data)

        profile, created = AdminProfile.objects.update_or_create(
            user=user,
            defaults={**validated_data, 'location': location}
        )
        return profile

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance



# -----------------------------
# Receiver Profile Serializer
# -----------------------------
class ReceiverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = ReceiverProfile
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        location_data = validated_data.pop('location', None)
        location = None
        if location_data:
            location = Location.objects.create(**location_data)

        profile, created = ReceiverProfile.objects.update_or_create(
            user=user,
            defaults={**validated_data, 'location': location}
        )
        return profile

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        request = self.context.get('request')
        user_data = request.data.get('user') if request else None
        if user_data:
            for attr in ['first_name', 'last_name', 'phone_number']:
                if attr in user_data:
                    setattr(instance.user, attr, user_data[attr])
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance




# -----------------------------
# Hospital Profile Serializer
# -----------------------------
class HospitalProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = HospitalProfile
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        location_data = validated_data.pop('location', None)
        location = None
        if location_data:
            location = Location.objects.create(**location_data)

        profile, created = HospitalProfile.objects.update_or_create(
            user=user,
            defaults={**validated_data, 'location': location}
        )
        return profile

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        new_file = validated_data.get('license_document', None)

        if new_file and instance.license_document:
            old_path = instance.license_document.path
            if os.path.exists(old_path):
                os.remove(old_path)

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        request = self.context.get('request')
        user_data = request.data.get('user') if request else None
        if user_data:
            for attr in ['first_name', 'last_name', 'phone_number']:
                if attr in user_data:
                    setattr(instance.user, attr, user_data[attr])
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance