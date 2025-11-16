from rest_framework import generics, permissions
from donors.models import DonorProfile, DonationRecord
from donors.serializers import DonorProfileSerializer, DonationRecordSerializer
from rest_framework.exceptions import NotFound, PermissionDenied
from django.db.models import Q
from datetime import timedelta
from django.utils import timezone
from analytics.models import ActivityLog

class DonorProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        today = timezone.now().date()
        ninety_days_ago = today - timedelta(days=90)

        if user.role in ["RECEIVER", "HOSPITAL"]:
            return DonorProfile.objects.filter(
                Q(last_donation_date__lte=ninety_days_ago) | Q(last_donation_date__isnull=True),
                is_available=True
            ).order_by('-id')
        if user.is_superuser or user.role == 'ADMIN':
            return DonorProfile.objects.all().order_by('-id')
        return DonorProfile.objects.filter(user=user, user__role='DONOR')

    def perform_create(self, serializer):
        donor_profile = getattr(self.request.user, 'donor_profile', None)
        serializer.save(donor=donor_profile)

class DonorProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DonorProfile.objects.all()
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        try:
            if user.is_superuser or user.role == 'ADMIN':
                return self.get_queryset().get(pk=self.kwargs['pk'])
            return user.donor_profile
        except DonorProfile.DoesNotExist:
            raise NotFound("Donor profile not found for this user.")

    def perform_update(self, serializer):
        user = self.request.user
        is_verified = str(self.request.data.get('is_verified')).lower() in ['true', '1', 'yes']
        verified_user = self.request.data.get('')

        if not (user.is_superuser or user.role == 'ADMIN') and is_verified:
            raise PermissionDenied("Only admins can verify donors.")

        serializer.save(
            is_verified=is_verified,
            verified_at=timezone.now() if is_verified else None,
            verified_by=user if is_verified else None
        )

        donor = serializer.instance
        donor_user = donor.user

        ActivityLog.objects.create(
            user=user,
            action='DONOR_VERIFIED' if is_verified else 'DONOR_UNVERIFIED',
            description=f"Admin '{user.username}' has {'verified' if is_verified else 'unverified'} donor '{donor_user.username}'.",
            ip_address=self.get_client_ip(self.request),
            user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
            metadata={"timestamp": timezone.now().isoformat()},
        )

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

class CurrentDonorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        
        if user.role != 'DONOR':
            raise PermissionDenied("Only DONOR users can have a donor profile.")

        donor_profile, _ = DonorProfile.objects.get_or_create(
            user=user,
            defaults={
                "date_of_birth": "2000-01-01",
                "blood_group": "",
                "gender": "M",
                "weight": None,
                "last_donation_date": None,
                "medical_conditions": "",
                "is_available": True,
                "location": None,
                "profile_photo": None,
                "bio": "",
                "willing_to_travel_km": 10,
            }
        )
        return donor_profile


class DonationRecordListCreateView(generics.ListCreateAPIView):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return DonationRecord.objects.all().order_by('-id')
        elif user.role == 'BLOOD_BANK':
            try:
                blood_bank = user.bloodbank
            except Exception:
                return DonationRecord.objects.none()

            return DonationRecord.objects.filter(
                blood_bank=blood_bank
            ).order_by('-id')
        return DonationRecord.objects.none()


class DonationRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
