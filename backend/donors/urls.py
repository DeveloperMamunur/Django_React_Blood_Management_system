from django.urls import path
from .views import (
    DonorProfileListCreateView, DonorProfileDetailView,
    DonationRecordListCreateView, DonationRecordDetailView
)

urlpatterns = [
    path('donors/profiles/', DonorProfileListCreateView.as_view(), name='donor-profile-list-create'),
    path('donors/profiles/<int:pk>/', DonorProfileDetailView.as_view(), name='donor-profile-detail'),
    path('donors/records/', DonationRecordListCreateView.as_view(), name='donation-record-list-create'),
    path('donors/records/<int:pk>/', DonationRecordDetailView.as_view(), name='donation-record-detail'),
]
