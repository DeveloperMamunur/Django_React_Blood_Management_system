from django.urls import path
from .views import (
    DonationStatisticsListCreateView, ActivityLogListCreateView,
    BloodRequestViewListCreateView, RequestViewStatisticsListCreateView
)
from .views_nearby import NearbyEntitiesView

urlpatterns = [
    path('analytics/donation-stats/', DonationStatisticsListCreateView.as_view(), name='donation-stats'),
    path('analytics/activity-logs/', ActivityLogListCreateView.as_view(), name='activity-logs'),
    path('analytics/request-views/', BloodRequestViewListCreateView.as_view(), name='request-views'),
    path('analytics/view-stats/', RequestViewStatisticsListCreateView.as_view(), name='view-stats'),
    path('nearby/', NearbyEntitiesView.as_view(), name='nearby-entities'),
]
