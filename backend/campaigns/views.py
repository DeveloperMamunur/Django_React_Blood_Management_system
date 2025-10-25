from rest_framework import generics, permissions
from campaigns.models import BloodDriveCampaign, CampaignRegistration
from campaigns.serializers import BloodDriveCampaignSerializer, CampaignRegistrationSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


class BloodDriveCampaignListCreateView(generics.ListCreateAPIView):
    queryset = BloodDriveCampaign.objects.all()
    serializer_class = BloodDriveCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(organizer=self.request.user)

class BloodDriveCampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodDriveCampaign.objects.all()
    serializer_class = BloodDriveCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class CampaignRegistrationListCreateView(generics.ListCreateAPIView):
    queryset = CampaignRegistration.objects.all()
    serializer_class = CampaignRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

class CampaignRegistrationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CampaignRegistration.objects.all()
    serializer_class = CampaignRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]