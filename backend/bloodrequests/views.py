from analytics.signals import request_created_signal
from rest_framework import generics, permissions
from django.db import models
from .models import BloodRequest
from analytics.models import ActivityLog, BloodRequestView, RequestViewStatistics
from .serializers import BloodRequestSerializer
from locations.models import Location
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from donors.models import DonationRecord, DonorProfile
from rest_framework import serializers


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
                models.Q(status="CANCELLED", approved_by=user) |
                models.Q(status="FULFILLED", approved_by=user)
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

            if user.role == "DONOR":
                donor_profile = user.donor_profile
                collected_by = None
            else:
                assigned_donor_id = self.request.data.get("assigned_donor")
                if not assigned_donor_id:
                    raise serializers.ValidationError({"assigned_donor": "No donor selected."})
                donor_profile = DonorProfile.objects.get(id=assigned_donor_id)
                collected_by = user

            blood_bank = instance.assigned_blood_bank

            DonationRecord.objects.create(
                donor=donor_profile,
                blood_group=instance.blood_group,
                blood_bank=blood_bank,
                donation_date=instance.required_by_date,
                units_donated=instance.units_required,
                related_request=instance,
                collected_by=collected_by
            )


        elif status == 'CANCELLED':
            update_data.update({
                'cancelled_by': user,
                'status': 'CANCELLED',
                'rejection_reason': "Request Cancelled by Donor",
            })
            action = 'REQUEST_CANCELLED'
            description = f"Request #{instance.id} cancelled by {user.username}"

            DonationRecord.objects.update_or_create(
                related_request=instance,
                defaults={
                    "status": "CANCELLED",
                    "notes": "Request Rejected by " + user.username + ", role: " + user.role
                }
            )

        elif status == 'REJECTED':
            update_data.update({
                'rejected_by': user,
                'status': 'REJECTED',
                'rejection_reason': self.request.data.get('rejection_reason', "Request Rejected"),
            })
            action = 'REQUEST_REJECTED'
            description = f"Request #{instance.id} rejected by {user.username}"
            DonationRecord.objects.filter(related_request=instance).update(
                status="REJECTED",
                notes=f"Request Rejected by {user.username}, role: {user.role}"
            )

        elif status == 'FULFILLED':
            update_data.update({
                'fulfilled_by': user,
                'status': 'FULFILLED',
                'approved_at': timezone.now(),
            })
            action = 'DONATION_COMPLETED'
            description = f"Request #{instance.id} marked as completed by {user.username}"

            donor_profile = instance.approved_by.donor_profile
            DonationRecord.objects.update_or_create(
                related_request=instance,
                donor=donor_profile,
                defaults={
                    "status": "COMPLETED",
                    "collected_by": user,
                    "notes": "Donation completed"
                }
            )
            DonorProfile.objects.filter(id=donor_profile.id).update(
                last_donation_date=timezone.now().date(),
                donation_points=models.F('donation_points') + 1,
                total_donations=models.F('total_donations') + 1
            )

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

class RecordBloodRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        try:
            blood_request = BloodRequest.objects.get(pk=pk)
        except BloodRequest.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user if request.user.is_authenticated else None
        ip_address = self.get_client_ip(request)
        session_key = self.get_or_create_session_key(request)

        view_obj, created = BloodRequestView.objects.get_or_create(
            blood_request=blood_request,
            session_key=session_key,
            defaults={
                "viewer": user,
                "ip_address": ip_address,
            }
        )

        if created:
            try:
                RequestViewStatistics.generate_daily_stats()
            except Exception as e:
                print("Error generating daily stats:", e)

        return Response({
            "message": "View recorded" if created else "Already viewed",
            "view_id": view_obj.id
        })

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.META.get("REMOTE_ADDR")

    def get_or_create_session_key(self, request):
        if not request.session.session_key:
            request.session.save()
        return request.session.session_key
