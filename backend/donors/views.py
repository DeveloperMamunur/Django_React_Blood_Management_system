from rest_framework import generics, permissions
from donors.models import DonorProfile, DonationRecord
from donors.serializers import DonorProfileSerializer, DonationRecordSerializer

class DonorProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return DonorProfile.objects.all().order_by('-id')
        return DonorProfile.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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


class DonationRecordListCreateView(generics.ListCreateAPIView):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]


class DonationRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
