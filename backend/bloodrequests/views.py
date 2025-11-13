from analytics.signals import request_created_signal
from rest_framework import generics, permissions
from django.db import models
from .models import BloodRequest
from analytics.models import ActivityLog
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
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(location__city__icontains=city)

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
        old_status = instance.status
        update_data = {}
        action = None
        description = ""

        if status == 'APPROVED':
            update_data.update({
                'approved_by': user,
                'approved_at': timezone.now(),
                'status': 'APPROVED',
            })
            action = 'REQUEST_APPROVED'
            description = f"Request #{instance.id} approved by {user.username}"

        elif status == 'CANCELLED':
            update_data.update({
                'cancelled_by': user,
                'status': 'CANCELLED',
                'rejection_reason': "Request Cancelled by Donor",
            })
            action = 'REQUEST_CANCELLED'
            description = f"Request #{instance.id} cancelled by {user.username}"

        elif status == 'REJECTED':
            update_data.update({
                'rejected_by': user,
                'status': 'REJECTED',
                'rejection_reason': self.request.data.get('rejection_reason', "Request Rejected"),
            })
            action = 'REQUEST_REJECTED'
            description = f"Request #{instance.id} rejected by {user.username}"

        elif status == 'FULFILLED':
            update_data.update({
                'fulfilled_by': user,
                'status': 'FULFILLED',
                'approved_at': timezone.now(),
            })
            action = 'DONATION_COMPLETED'
            description = f"Request #{instance.id} marked as completed by {user.username}"

        elif status == 'PENDING':
            update_data.update({
                'approved_by': None,
                'approved_at': None,
                'cancelled_by': None,
                'rejected_by': None,
                'fulfilled_by': None,
                'status': 'PENDING',
            })
            action = 'REQUEST_RESET'
            description = f"Request #{instance.id} reset to PENDING by {user.username}"

        else:
            update_data['status'] = status
            action = 'REQUEST_UPDATED'
            description = f"Request #{instance.id} status changed to {status}"

        instance = serializer.save(**update_data)

        if action:
            ActivityLog.objects.create(
                user=user,
                action=action,
                description=description,
                ip_address=self.get_client_ip(self.request),
                user_agent=self.request.META.get('HTTP_USER_AGENT', ''),
                metadata={
                    "request_id": instance.id,
                    "old_status": old_status,
                    "new_status": status,
                    "timestamp": timezone.now().isoformat(),
                },
            )

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

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
