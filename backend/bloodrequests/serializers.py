from rest_framework import serializers
from requests.models import BloodRequest
from accounts.serializers import UserSerializer, HospitalProfileSerializer
from locations.serializers import LocationSerializer
from bloodbanks.serializers import BloodBankSerializer


class BloodRequestSerializer(serializers.ModelSerializer):
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    hospital = HospitalProfileSerializer(required=False, allow_null=True)
    assigned_blood_bank = BloodBankSerializer(required=False, allow_null=True)
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = BloodRequest
        fields = '__all__'
