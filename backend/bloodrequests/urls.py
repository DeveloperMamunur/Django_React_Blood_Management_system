from django.urls import path
from .views import BloodRequestListCreateView, BloodRequestDetailView

urlpatterns = [
    path('requests/', BloodRequestListCreateView.as_view(), name='bloodrequest-list-create'),
    path('requests/<int:pk>/', BloodRequestDetailView.as_view(), name='bloodrequest-detail'),
]