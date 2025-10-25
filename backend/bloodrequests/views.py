from analytics.signals import request_created_signal
from rest_framework import generics, permissions
from .models import BloodRequest
from .serializers import BloodRequestSerializer
from locations.models import Location


class BloodRequestListCreateView(generics.ListCreateAPIView):
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

        if user.role != 'ADMIN':
            queryset = queryset.filter(requested_by=user)

        return queryset


class BloodRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = BloodRequest.objects.all()

        if user.role != 'ADMIN':
            queryset = queryset.filter(requested_by=user)

        return queryset
