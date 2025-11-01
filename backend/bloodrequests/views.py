from analytics.signals import request_created_signal
from rest_framework import generics, permissions
from django.db import models
from .models import BloodRequest
from .serializers import BloodRequestSerializer
from locations.models import Location
from django.utils import timezone


class BloodRequestListCreateView(generics.ListCreateAPIView):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save(requested_by=self.request.user)
        request_created_signal.send(
            sender=self.__class__,
            request=self.request,
            blood_request=instance
        )

    def get_queryset(self):
        user = self.request.user
        queryset = BloodRequest.objects.all()

        location_id = self.request.query_params.get('location_id')
        if location_id:
            queryset = queryset.filter(location_id=location_id)

        if user.role == 'DONOR':
            queryset = queryset.filter(
                models.Q(status="PENDING") |
                models.Q(status="APPROVED", approved_by=user) |
                models.Q(status="CANCELLED", approved_by=user)
            )
        elif user.role == 'ADMIN' or user.is_superuser:
            return queryset
        else:
            queryset = queryset.filter(requested_by=user)

        return queryset


class BloodRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        status = self.request.data.get('status')
        user = self.request.user
        instance = serializer.instance

        update_data = {}

        if status == 'APPROVED':
            update_data['approved_by'] = user
            update_data['approved_at'] = timezone.now()

        elif status == 'CANCELLED':
            update_data['approved_by'] = user
            update_data['status'] = 'CANCELLED'
            update_data['rejection_reason'] = "Request Cancelled"

        elif status == 'REJECTED':
            update_data['rejected_by'] = user
            update_data['rejection_reason'] = self.request.data.get(
                'rejection_reason', "Request Rejected"
            )

        elif status == 'COMPLETED':
            update_data['completed_by'] = user
            update_data['completed_at'] = timezone.now()

        else:
            update_data['status'] = status

        serializer.save(**update_data)

    def get_queryset(self):
        user = self.request.user
        queryset = BloodRequest.objects.all()

        if user.role == 'DONOR':
            queryset = queryset.filter(
                models.Q(status="PENDING") |
                models.Q(status="APPROVED", approved_by=user) |
                models.Q(status="CANCELLED", approved_by=user)
            )
        elif user.role == 'ADMIN' or user.is_superuser:
            return queryset
        else:
            queryset = queryset.filter(requested_by=user)

        return queryset

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True 
        return super().update(request, *args, **kwargs)
