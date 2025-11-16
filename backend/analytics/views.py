from rest_framework import generics, permissions
from .models import (
    DonationStatistics, ActivityLog,
    BloodRequestView, RequestViewStatistics
)
from .serializers import (
    DonationStatisticsSerializer, ActivityLogSerializer,
    BloodRequestViewSerializer, RequestViewStatisticsSerializer
)
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response


class DonationStatisticsListCreateView(generics.ListCreateAPIView):
    queryset = DonationStatistics.objects.all()
    serializer_class = DonationStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]




class ActivityLogListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_superuser and not self.request.user.role == 'ADMIN':
            if self.request.activity_log == 'ALL':
                return ActivityLog.objects.all().order_by('-created_at')
            elif self.request.activity_log == 'USER_USER_LOGOUTS' or self.request.activity_log == 'USER_LOGOUTS':
                return ActivityLog.objects.filter(user=self.request.user).order_by('-created_at')

            return ActivityLog.objects.filter(user=self.request.user).order_by('-created_at')
        return ActivityLog.objects.all().order_by('-created_at')


class BloodRequestViewListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        seven_days_ago = timezone.now() - timedelta(days=7)
        
        daily_stats = (
            BloodRequestView.objects
            .filter(viewed_at__gte=seven_days_ago)
            .annotate(date=TruncDate('viewed_at'))
            .values('date')
            .annotate(
                total_views=Count('id'),
                unique_viewers=Count('viewer', distinct=True) + 
                              Count('session_key', distinct=True, filter=Q(viewer__isnull=True))
            )
            .order_by('date')
        )
        
        results = [
            {
                'date': stat['date'].strftime('%Y-%m-%d'),
                'total_views': stat['total_views'],
                'unique_viewers': stat['unique_viewers']
            }
            for stat in daily_stats
        ]
        
        return Response({'results': results})


class RequestViewStatisticsListCreateView(generics.ListCreateAPIView):
    queryset = RequestViewStatistics.objects.all()
    serializer_class = RequestViewStatisticsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        seven_days_ago = timezone.now().date() - timedelta(days=7)
        
        queryset = RequestViewStatistics.objects.filter(
            date__gte=seven_days_ago
        ).order_by('-date')
        
        if not self.request.user.is_superuser and self.request.user.role != 'ADMIN':
            pass
        return queryset
