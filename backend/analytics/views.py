from rest_framework import generics, permissions
from .models import (
    DonationStatistics, ActivityLog,
    BloodRequestView, RequestViewStatistics
)
from .serializers import (
    DonationStatisticsSerializer, ActivityLogSerializer,
    BloodRequestViewSerializer, RequestViewStatisticsSerializer
)


class DonationStatisticsListCreateView(generics.ListCreateAPIView):
    queryset = DonationStatistics.objects.all()
    serializer_class = DonationStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]




class ActivityLogListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_superuser and not self.request.user.role == 'ADMIN':
            return ActivityLog.objects.filter(user=self.request.user).order_by('-created_at')
        return ActivityLog.objects.all().order_by('-created_at')


class BloodRequestViewListCreateView(generics.ListCreateAPIView):
    queryset = BloodRequestView.objects.all()
    serializer_class = BloodRequestViewSerializer
    permission_classes = [permissions.IsAuthenticated]


class RequestViewStatisticsListCreateView(generics.ListCreateAPIView):
    queryset = RequestViewStatistics.objects.all()
    serializer_class = RequestViewStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]
