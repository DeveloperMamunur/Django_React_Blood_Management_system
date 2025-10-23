from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import ReceiverProfile, HospitalProfile
from locations.serializers import LocationSerializer

User = get_user_model()


# -----------------------------
# Register Serializer
# -----------------------------
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2', 'role']

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
        return user


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
# Receiver Profile Serializer
# -----------------------------
class ReceiverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = ReceiverProfile
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        location_data = validated_data.pop('location', None)

        user = UserSerializer().create(user_data)
        location = LocationSerializer().create(location_data) if location_data else None
        return ReceiverProfile.objects.create(user=user, location=location, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        location_data = validated_data.pop('location', None)

        if user_data:
            UserSerializer().update(instance.user, user_data)
        if location_data:
            if instance.location:
                LocationSerializer().update(instance.location, location_data)
            else:
                instance.location = LocationSerializer().create(location_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance




# -----------------------------
# Hospital Profile Serializer
# -----------------------------
class HospitalProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = HospitalProfile
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        location_data = validated_data.pop('location', None)

        user = UserSerializer().create(user_data)
        location = LocationSerializer().create(location_data) if location_data else None

        return HospitalProfile.objects.create(user=user, location=location, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        location_data = validated_data.pop('location', None)

        if user_data:
            UserSerializer().update(instance.user, user_data)
        if location_data:
            if instance.location:
                LocationSerializer().update(instance.location, location_data)
            else:
                instance.location = LocationSerializer().create(location_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance