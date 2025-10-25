from rest_framework import serializers
from bloodbanks.models import BloodBank, BloodInventory
from locations.models import Location
from accounts.models import User
from locations.serializers import LocationSerializer
from accounts.serializers import UserSerializer
from locations.serializers import LocationSerializer
import os

class BloodInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodInventory
        fields = '__all__'
        read_only_fields = ['blood_bank'] 

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        blood_bank = BloodBank.objects.filter(managed_by=user).first()
        if not blood_bank:
            raise serializers.ValidationError("No blood bank is associated with this user.")

        inventory, created = BloodInventory.objects.update_or_create(
            blood_bank=blood_bank,
            blood_group=validated_data.get('blood_group'),
            defaults=validated_data,
        )

        return inventory


class BloodBankSerializer(serializers.ModelSerializer):
    location = LocationSerializer(required=False, allow_null=True)
    managed_by = UserSerializer(read_only=True)
    inventory = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BloodBank
        fields = '__all__'

    def get_inventory(self, obj):
        if hasattr(obj, "inventory"):
            return [
                {
                    "blood_group": inv.blood_group,
                    "units_available": inv.units_available,
                }
                for inv in obj.inventory.all()
            ]
        return []

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None

        location_data = validated_data.pop("location", None)
        location = None
        if location_data:
            location = Location.objects.create(**location_data)

        bank, created = BloodBank.objects.update_or_create(
            managed_by=user,
            defaults={**validated_data, "location": location},
        )
        return bank

    def update(self, instance, validated_data):
        location_data = validated_data.pop("location", None)

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
