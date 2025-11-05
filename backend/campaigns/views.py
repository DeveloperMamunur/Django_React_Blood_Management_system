from rest_framework import generics, permissions, status
from campaigns.models import BloodDriveCampaign, CampaignRegistration
from campaigns.serializers import BloodDriveCampaignSerializer, CampaignRegistrationSerializer, CampaignListSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class BloodDriveCampaignListCreateView(generics.ListCreateAPIView):
    queryset = BloodDriveCampaign.objects.all().order_by("-start_date")
    serializer_class = BloodDriveCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, "role", None) == "ADMIN":
            return BloodDriveCampaign.objects.all().order_by("-start_date")
        return BloodDriveCampaign.objects.filter(organizer=user).order_by("-start_date")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(organizer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BloodDriveCampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodDriveCampaign.objects.all()
    serializer_class = BloodDriveCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class CampaignAuthListView(generics.ListAPIView):
    serializer_class = BloodDriveCampaignSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.role == "ADMIN":
            return BloodDriveCampaign.objects.all().order_by("-start_date")
        if self.request.user.role == 'DONOR':
            return BloodDriveCampaign.objects.filter(status="ACTIVE").order_by("-start_date")
        return BloodDriveCampaign.objects.filter(organizer=self.request.user).order_by("-start_date")

class CampaignListView(generics.ListAPIView):
    queryset = BloodDriveCampaign.objects.filter(status="ACTIVE").order_by("-start_date")[:3]
    serializer_class = CampaignListSerializer
    permission_classes = [AllowAny]

class CampaignDetailsView(generics.RetrieveAPIView):
    queryset = BloodDriveCampaign.objects.all()
    serializer_class = CampaignListSerializer
    permission_classes = [AllowAny]

class CampaignRegistrationListCreateView(generics.ListCreateAPIView):
    queryset = CampaignRegistration.objects.all()
    serializer_class = CampaignRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CampaignRegistration.objects.filter(campaign=self.kwargs['campaign_pk'])

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['campaign_id'] = self.kwargs.get('campaign_pk')
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class CampaignRegistrationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CampaignRegistration.objects.all()
    serializer_class = CampaignRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]