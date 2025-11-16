from rest_framework import serializers
from bloodbanks.models import BloodBank, BloodInventory
from locations.models import Location
from accounts.models import User
from locations.serializers import LocationSerializer
from accounts.serializers import UserSerializer
from locations.serializers import LocationSerializer
import os

class BloodInventorySerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    class Meta:
        model = BloodInventory
        fields = '__all__'
        read_only_fields = ['blood_bank'] 

    def get_status(self, obj):
        if obj.units_available < obj.critical_threshold:
            return "critical"
        elif obj.units_available < obj.minimum_threshold:
            return "low"
        elif obj.units_available < 50:
            return "normal"
        else:
            return "full"

    def create(self, validated_data):
        request = self.context.get('request')
        bank_pk = self.context.get('view').kwargs.get('bank_pk')
        user = request.user if request else None

        blood_bank = BloodBank.objects.filter(id=bank_pk, managed_by=user).first()
        if not blood_bank:
            raise serializers.ValidationError("You are not authorized to modify this blood bank.")

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
    city_country = serializers.SerializerMethodField(read_only=True)
    verified_by = UserSerializer(read_only=True)

    class Meta:
        model = BloodBank
        fields = '__all__'

    def get_city_country(self, obj):
        return obj.city_country()

    def get_inventory(self, obj):
        inventory = obj.inventory.all()
        return BloodInventorySerializer(inventory, many=True).data

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request else None
        if user and user.role != 'BLOOD_BANK':
            raise serializers.ValidationError(
                "Only users with BLOOD_BANK can create blood banks"
            )

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
        managed_by_data = self.context['request'].data.get('managed_by')

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        if managed_by_data:
            user = instance.managed_by
            for attr in ['first_name', 'last_name', 'phone_number', 'email']:
                if attr in managed_by_data:
                    setattr(user, attr, managed_by_data[attr])
            user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
