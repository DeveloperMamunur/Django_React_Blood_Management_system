from django.urls import path
from .views import (
    BloodDriveCampaignListCreateView, BloodDriveCampaignDetailView,
    CampaignRegistrationListCreateView, CampaignRegistrationDetailView
)

urlpatterns = [
    path('campaigns/', BloodDriveCampaignListCreateView.as_view(), name='campaign-list-create'),
    path('campaigns/<int:pk>/', BloodDriveCampaignDetailView.as_view(), name='campaign-detail'),
    path('campaigns/registrations/', CampaignRegistrationListCreateView.as_view(), name='registration-list-create'),
    path('campaigns/registrations/<int:pk>/', CampaignRegistrationDetailView.as_view(), name='registration-detail'),
]
