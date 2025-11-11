from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model, authenticate
from .models import HospitalProfile, ReceiverProfile, AdminProfile
from donors.models import DonorProfile
from analytics.models import ActivityLog 
from django.utils import timezone
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db import transaction

from accounts.serializers import (
    UserSerializer,
    UserRegisterSerializer,
    UserLoginSerializer,
    PasswordChangeSerializer,
    HospitalProfileSerializer,
    ReceiverProfileSerializer,
    AdminProfileSerializer,
    AllHospitalListSerializer
)
from donors.serializers import DonorProfileSerializer
from common.utils.distance import calculate_distance

User = get_user_model()

# -----------------------------
# User Register
# -----------------------------
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


# -----------------------------
# User Login
# -----------------------------
class UserLoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            # If login successful
            if response.status_code == 200:
                user = self.get_user(request)
                if user:
                    ActivityLog.objects.create(
                        user=user,
                        action="USER_LOGIN",
                        description=f"User '{user.username}' logged in successfully.",
                        ip_address=self.get_client_ip(request),
                        user_agent=request.META.get('HTTP_USER_AGENT', ''),
                        metadata={
                            "timestamp": timezone.now().isoformat(),
                        }
                    )
            return response
        except Exception as e:
            return Response(
                {"detail": "The password or username does not match"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

    def get_user(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=False)
        return serializer.user if hasattr(serializer, 'user') else None

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# -----------------------------
# User Logout (JWT Blacklist)
# -----------------------------
class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            # Token already blacklisted or invalid
            pass
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)


# -----------------------------
# Password Change
# -----------------------------
class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)


# -----------------------------
# User Profile
# -----------------------------
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# -----------------------------
# Existing Generic CRUD Views
# -----------------------------
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'ADMIN'):
            raise PermissionDenied("Only admins can create new users.")
        role = self.request.data.get('role')
        if role == 'ADMIN':
            raise PermissionDenied("Cannot create another admin user.")
        password = self.request.data.get('password')
        with transaction.atomic():
            instance = serializer.save(created_by=user)
            if password:
                instance.set_password(password)
            else:
                instance.set_unusable_password()
            instance.save()



class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return self.get_queryset().get(pk=self.kwargs['pk'])
        return user

    def perform_update(self, serializer):
        user = self.request.user
        target_user = self.get_object()
        if not (user.is_superuser or user.role == 'ADMIN'):
            if target_user != user:
                raise PermissionDenied("You can only update your own profile.")
            
            allowed_fields = {'first_name', 'last_name', 'email', 'phone_number'}
            for field in list(serializer.validated_data.keys()):
                if field not in allowed_fields:
                    serializer.validated_data.pop(field)
        
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if not (user.is_superuser or user.role == 'ADMIN'):
            raise PermissionDenied("Only admins can delete users.")
        instance.delete()

# -----------------------------
# Admin Profiles
# -----------------------------
class AdminProfileListCreateView(generics.ListCreateAPIView):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.is_superuser:
            return AdminProfile.objects.all()
        return AdminProfile.objects.filter(user=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context



class AdminProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.request.is_superuser or self.request.user.role == 'ADMIN':
            return self.get_queryset().get(pk=self.kwargs['pk'])
        return self.request.user.admin_profile

class CurrentAdminProfileView(generics.RetrieveAPIView):
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role != 'ADMIN':
            raise PermissionDenied("Only ADMIN users can have an admin profile.")
        admin_profile, created = AdminProfile.objects.get_or_create(
            user=user,
            defaults={
                "age": 0,
                "blood_group": "",
                "contact_number": "",
                "emergency_contact": "",
                "notes": "",
                "location": None,
                "created_at": None,
                "updated_at": None,
            },
        )
        return admin_profile

# -----------------------------
# Receiver Profiles
# -----------------------------
class ReceiverProfileListCreateView(generics.ListCreateAPIView):
    queryset = ReceiverProfile.objects.all()
    serializer_class = ReceiverProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        receiver_profile = getattr(self.request.user, 'receiver_profile', None)
        serializer.save(receiver=receiver_profile)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return ReceiverProfile.objects.all()
        return ReceiverProfile.objects.filter(user=user, user__role='RECEIVER')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context



class ReceiverProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReceiverProfile.objects.all()
    serializer_class = ReceiverProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        if self.request.user.is_superuser or self.request.user.role == 'ADMIN':
            return self.get_queryset().get(pk=self.kwargs['pk'])
        return self.request.user.receiver_profile

class CurrentReceiverProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ReceiverProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role != 'RECEIVER':
            raise PermissionDenied("Only RECEIVER users can have a receiver profile.")
        receiver_profile, created = ReceiverProfile.objects.get_or_create(
            user=user,
            defaults={
                "age": 0,
                "blood_group": "",
                "contact_number": "",
                "emergency_contact": "",
                "notes": "",
                "location": None,
                "created_at": None,
                "updated_at": None,
            },
        )
        return receiver_profile
# -----------------------------
# Hospital Profiles
# -----------------------------
class HospitalProfileListCreateView(generics.ListCreateAPIView):
    queryset = HospitalProfile.objects.all()
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        hospital_profile = getattr(self.request.user, 'hospital_profile', None)
        serializer.save(hospital=hospital_profile)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return HospitalProfile.objects.all()
        return HospitalProfile.objects.filter(user=user, user__role='HOSPITAL')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class HospitalProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = HospitalProfile.objects.all()
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        try:
            if user.is_superuser or user.role == 'ADMIN':
                return self.get_queryset().get(pk=self.kwargs['pk'])
            return user.hospital_profile
        except HospitalProfile.DoesNotExist:
            raise NotFound("Hospital profile not found for this user.")

class CurrentHospitalProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role != 'HOSPITAL':
            raise PermissionDenied("Only HOSPITAL users can have a hospital profile.")

        hospital_profile, created = HospitalProfile.objects.get_or_create(
            user=user,
            defaults={
                "hospital_name": "",
                "registration_number": None,
                "hospital_type": "",
                "emergency_contact": "",
                "website": "",
                "has_blood_bank": False,
                "bed_capacity": None,
                "is_verified": False,
                "license_document": None,
                "created_at": None,
                "updated_at": None,
            },
        )
        return hospital_profile


class AllHospitalList(generics.ListAPIView):
    queryset = HospitalProfile.objects.all()
    serializer_class = AllHospitalListSerializer
    permission_classes = [permissions.AllowAny]


# -----------------------------
# Nearby Donors
# -----------------------------
class NearbyDonorsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not hasattr(user, 'receiver_profile'):
            return Response({"error": "Only receivers can find nearby donors."}, status=400)

        receiver_location = user.receiver_profile.location
        donors = DonorProfile.objects.select_related('user', 'location')

        data = []
        for donor in donors:
            dist = calculate_distance(
                receiver_location.latitude,
                receiver_location.longitude,
                donor.location.latitude,
                donor.location.longitude
            )
            data.append({
                "donor_id": donor.id,
                "name": donor.user.get_full_name(),
                "blood_group": donor.blood_group,
                "distance_km": dist,
            })

        # Sort donors by nearest distance
        data = sorted(data, key=lambda x: x['distance_km'])
        return Response(data)