from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserListCreateView, UserDetailView,
    UserRegisterView, UserLoginView, UserLogoutView,
    PasswordChangeView, UserProfileView, 
    ReceiverProfileListCreateView, ReceiverProfileDetailView,
    HospitalProfileListCreateView, HospitalProfileDetailView,
    AdminProfileListCreateView, AdminProfileDetailView,
    NearbyDonorsView, CurrentReceiverProfileView, CurrentHospitalProfileView,
    AllHospitalList
)

urlpatterns = [
    # Authentication
    path('auth/register/', UserRegisterView.as_view(), name='user-register'),
    path('auth/login/', UserLoginView.as_view(), name='user-login'),
    path('auth/login/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('auth/password/change/', PasswordChangeView.as_view(), name='password-change'),
    path('auth/user/profile/', UserProfileView.as_view(), name='user-profile'),

    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    path('receivers/', ReceiverProfileListCreateView.as_view(), name='receiver-list-create'),
    path('receivers/<int:pk>/', ReceiverProfileDetailView.as_view(), name='receiver-detail'),
    path('receivers/current-profile/', CurrentReceiverProfileView.as_view(), name='current-receiver-profile'),

    path('hospitals/', HospitalProfileListCreateView.as_view(), name='hospital-list-create'),
    path('hospitals/<int:pk>/', HospitalProfileDetailView.as_view(), name='hospital-detail'),
    path('hospitals/current-profile/', CurrentHospitalProfileView.as_view(), name='current-hospital-profile'),
    path('hospitals/all/', AllHospitalList.as_view(), name='all-hospital-list'),

    path('admin/', AdminProfileListCreateView.as_view(), name='admin-list-create'),
    path('admin/<int:pk>/', AdminProfileDetailView.as_view(), name='admin-detail'),

    path('nearby-donors/', NearbyDonorsView.as_view(), name='nearby-donors'),
]
