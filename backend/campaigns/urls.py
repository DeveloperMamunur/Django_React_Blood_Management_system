from django.urls import path
from .views import (
    BloodDriveCampaignListCreateView, BloodDriveCampaignDetailView,
    CampaignRegistrationListCreateView, CampaignRegistrationDetailView,
    CampaignListView, CampaignDetailsView, CampaignAuthListView
)

urlpatterns = [
    path('campaigns/', BloodDriveCampaignListCreateView.as_view(), name='campaign-list-create'),
    path('auth/campaigns/all/', CampaignAuthListView.as_view(), name='campaign-auth-list'),
    path('campaigns/<int:pk>/', BloodDriveCampaignDetailView.as_view(), name='campaign-detail'),
    path('campaigns/<int:campaign_pk>/registrations/', CampaignRegistrationListCreateView.as_view(), name='registration-list-create'),
    path('campaigns/<int:campaign_pk>/registrations/<int:pk>/', CampaignRegistrationDetailView.as_view(), name='registration-detail'),
    path('campaigns/list/', CampaignListView.as_view(), name='registration-list'),
    path('campaigns/details/<int:pk>/', CampaignDetailsView.as_view(), name='public-campaign-detail'),
]
