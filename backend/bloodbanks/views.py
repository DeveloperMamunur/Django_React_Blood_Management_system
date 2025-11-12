from django.db.models import Sum, Q, Min
from rest_framework import generics, permissions
from rest_framework.response import Response
from bloodbanks.models import BloodBank, BloodInventory
from bloodbanks.serializers import BloodBankSerializer, BloodInventorySerializer
from rest_framework.exceptions import NotFound, PermissionDenied
from analytics.signals import inventory_updated_signal


class BloodBankListCreateView(generics.ListCreateAPIView):
    queryset = BloodBank.objects.all()
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        blood_banks = getattr(self.request.user, 'blood_banks', None)
        serializer.save(blood_banks=blood_banks)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return BloodBank.objects.all()
        if user.role == 'BLOOD_BANK':
            return BloodBank.objects.filter(managed_by=user)
        return BloodBank.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class BloodBankDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodBank.objects.all()
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        try:
            if user.is_staff or user.role == 'ADMIN':
                return self.get_queryset().get(pk=self.kwargs['pk'])
            return user.managed_blood_banks
        except BloodBank.DoesNotExist:
            raise NotFound("No blood bank found for this user.")

class CurrentBloodBankView(generics.RetrieveAPIView):
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role != 'BLOOD_BANK':
            raise PermissionDenied("Only BLOOD_BANK users can have a blood bank profile.")

        blood_bank, created = BloodBank.objects.get_or_create(
            managed_by=user,
            defaults={
                "name": "",
                "registration_number": "",
                "contact_person": "",
                "contact_number": "",
                "email": "",
                "operating_hours": "",
                "storage_capacity": 0,
                "is_active": True,
            },
        )
        return blood_bank

class bloodBankListView(generics.ListAPIView):
    queryset = BloodBank.objects.all()
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.AllowAny]



    def get_status(self, obj):
        if obj.units_available < obj.critical_threshold:
            return "critical"
        elif obj.units_available < obj.minimum_threshold:
            return "low"
        elif obj.units_available < 50:
            return "normal"
        else:
            return "full"
    

class BloodInventoryListCreateView(generics.ListCreateAPIView):
    queryset = BloodInventory.objects.all()
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        bank_pk = self.kwargs.get('bank_pk')
        user = self.request.user
        qs = BloodInventory.objects.filter(blood_bank_id=bank_pk)

        if user.is_superuser or user.role == 'ADMIN':
            return qs
        return qs.filter(blood_bank__managed_by=user)

class BloodInventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodInventory.objects.all()
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        blood_bank = BloodBank.objects.filter(managed_by=self.request.user).first()
        serializer.save(blood_bank=blood_bank)
        inventory_updated_signal.send(
            sender=self.__class__,
            request=self.request,
            inventory=serializer.instance
        )

    def get_queryset(self):
        bank_pk = self.kwargs.get('bank_pk')
        user = self.request.user
        qs = BloodInventory.objects.filter(blood_bank_id=bank_pk)
        if user.is_superuser or user.role == 'ADMIN':
            return qs
        return qs.filter(blood_bank__managed_by=user)

class BloodInventoryListView(generics.ListAPIView):
    queryset = BloodInventory.objects.all()
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = BloodInventory.objects.all()

        if user.is_superuser or user.role == 'ADMIN':
            blood_group = self.kwargs.get('blood_group')
            if blood_group:
                return qs.filter(blood_group=blood_group)
            return qs
        return BloodInventory.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = super().list(request, *args, **kwargs)

        total_available = queryset.aggregate(total=Sum('units_available'))['total'] or 0
        total_reserved = queryset.aggregate(total=Sum('units_reserved'))['total'] or 0

        group_totals = []
        for group in queryset.values('blood_group').distinct():
            group_records = queryset.filter(blood_group=group['blood_group'])
            total_available_group = group_records.aggregate(Sum('units_available'))['units_available__sum'] or 0
            total_reserved_group = group_records.aggregate(Sum('units_reserved'))['units_reserved__sum'] or 0

            group_totals.append({
                'blood_group': group['blood_group'],
                'total_available': total_available_group,
                'total_reserved': total_reserved_group,
            })

        return Response({
            "results": response.data,
            "total_available": total_available,
            "total_reserved": total_reserved,
            "total_units": total_available + total_reserved,
            "group_totals": group_totals,
        })