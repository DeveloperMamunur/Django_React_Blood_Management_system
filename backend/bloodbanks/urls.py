from django.urls import path
from .views import (
    BloodBankListCreateView, BloodBankDetailView,
    BloodInventoryListCreateView, BloodInventoryDetailView,
    CurrentBloodBankView
)

urlpatterns = [
    path('bloodbanks/', BloodBankListCreateView.as_view(), name='bloodbank-list-create'),
    path('bloodbanks/<int:pk>/', BloodBankDetailView.as_view(), name='bloodbank-detail'),
    path('bloodbanks/<int:bank_pk>/inventory/', BloodInventoryListCreateView.as_view(), name='inventory-list-create'),
    path('bloodbanks/<int:bank_pk>/inventory/<int:pk>/', BloodInventoryDetailView.as_view(), name='inventory-detail'),
    path('bloodbanks/current/', CurrentBloodBankView.as_view(), name='current-bloodbank'),
]
