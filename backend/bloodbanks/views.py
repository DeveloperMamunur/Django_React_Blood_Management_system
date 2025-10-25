from rest_framework import generics, permissions
from bloodbanks.models import BloodBank, BloodInventory
from bloodbanks.serializers import BloodBankSerializer, BloodInventorySerializer
from rest_framework.exceptions import NotFound
from analytics.signals import inventory_updated_signal


class BloodBankListCreateView(generics.ListCreateAPIView):
    queryset = BloodBank.objects.all()
    serializer_class = BloodBankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return BloodBank.objects.all()
        return BloodBank.objects.filter(managed_by=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class BloodBankDetailView(generics.RetrieveUpdateDestroyAPIView):
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


class BloodInventoryListCreateView(generics.ListCreateAPIView):
    queryset = BloodInventory.objects.all()
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return BloodInventory.objects.all()
        return BloodInventory.objects.filter(blood_bank__managed_by=user)


class BloodInventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodInventory.objects.all()
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(blood_bank=self.request.user.managed_blood_banks)
        inventory_updated_signal.send(
            sender=self.__class__,
            request=self.request,
            inventory=serializer.instance
        )

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'ADMIN':
            return BloodInventory.objects.all()
        return BloodInventory.objects.filter(blood_bank__managed_by=user)