from rest_framework import serializers
from .models import BloodRequest
from accounts.serializers import UserSerializer, HospitalProfileSerializer
from locations.serializers import LocationSerializer
from bloodbanks.serializers import BloodBankSerializer
from accounts.models import HospitalProfile
from bloodbanks.models import BloodBank
from locations.models import Location


class BloodRequestSerializer(serializers.ModelSerializer):
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    hospital = HospitalProfileSerializer(read_only=True)
    assigned_blood_bank = BloodBankSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)

    hospital_id = serializers.PrimaryKeyRelatedField(
        queryset=HospitalProfile.objects.all(),
        source='hospital',
        write_only=True,
        required=False,
        allow_null=True
    )
    assigned_blood_bank_id = serializers.PrimaryKeyRelatedField(
        queryset=BloodBank.objects.all(),
        source='assigned_blood_bank',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = BloodRequest
        fields = '__all__'

    def to_internal_value(self, data):
        location_data = data.get('location', None)

        if isinstance(location_data, dict):
            data = data.copy()
            data.pop('location')

            internal = super().to_internal_value(data)
            location_serializer = LocationSerializer(data=location_data)
            location_serializer.is_valid(raise_exception=True)
            internal['location'] = location_serializer.save()
            return internal

        return super().to_internal_value(data)

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        validated_data['requested_by'] = user

        instance = BloodRequest(**validated_data)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        location_data = self.context.get('request').data.get('location', None)

        if isinstance(location_data, dict):
            if instance.location:
                loc_serializer = LocationSerializer(instance.location, data=location_data, partial=True)
                loc_serializer.is_valid(raise_exception=True)
                loc_serializer.save()
            else:
                loc_serializer = LocationSerializer(data=location_data)
                loc_serializer.is_valid(raise_exception=True)
                instance.location = loc_serializer.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
