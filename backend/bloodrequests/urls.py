from django.urls import path
from .views import BloodRequestListCreateView, BloodRequestDetailView,RecordBloodRequestView

urlpatterns = [
    path('requests/', BloodRequestListCreateView.as_view(), name='blood-request-list-create'),
    path('requests/<int:pk>/', BloodRequestDetailView.as_view(), name='blood-request-detail'),
    path('requests/<int:pk>/view/', RecordBloodRequestView.as_view(), name='record-blood-request-view'),
]