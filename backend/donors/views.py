from rest_framework import generics, permissions
from donors.models import DonorProfile, DonationRecord
from donors.serializers import DonorProfileSerializer, DonationRecordSerializer
from rest_framework.exceptions import NotFound

class DonorProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
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


class DonationRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
