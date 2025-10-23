from rest_framework import serializers
from bloodbanks.models import BloodBank, BloodInventory
from locations.serializers import LocationSerializer
from accounts.serializers import UserSerializer


class BloodInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodInventory
        fields = '__all__'


class BloodBankSerializer(serializers.ModelSerializer):
    location = LocationSerializer(required=False)
    managed_by = UserSerializer(required=False)
    inventory = BloodInventorySerializer(many=True, read_only=True)

    class Meta:
        model = BloodBank
        fields = '__all__'

    def create(self, validated_data):
        location_data = validated_data.pop('location', None)
        manager_data = validated_data.pop('managed_by', None)

        location = LocationSerializer().create(location_data) if location_data else None
        managed_by = None
        if manager_data:
            managed_by = UserSerializer().create(manager_data)

        return BloodBank.objects.create(location=location, managed_by=managed_by, **validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        manager_data = validated_data.pop('managed_by', None)

        if location_data:
            if instance.location:
                LocationSerializer().update(instance.location, location_data)
            else:
                instance.location = LocationSerializer().create(location_data)

        if manager_data:
            UserSerializer().update(instance.managed_by, manager_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
