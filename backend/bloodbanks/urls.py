from django.urls import path
from .views import (
    BloodBankListCreateView, BloodBankDetailView,
    BloodInventoryListCreateView, BloodInventoryDetailView
)

urlpatterns = [
    path('bloodbanks/', BloodBankListCreateView.as_view(), name='bloodbank-list-create'),
    path('bloodbanks/<int:pk>/', BloodBankDetailView.as_view(), name='bloodbank-detail'),
    path('bloodbanks/inventory/', BloodInventoryListCreateView.as_view(), name='inventory-list-create'),
    path('bloodbanks/inventory/<int:pk>/', BloodInventoryDetailView.as_view(), name='inventory-detail'),
]
