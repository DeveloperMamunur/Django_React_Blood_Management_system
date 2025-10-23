from rest_framework import serializers
from donors.models import DonorProfile, DonationRecord
from accounts.serializers import UserSerializer
from locations.serializers import LocationSerializer


class DonorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = DonorProfile
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        location_data = validated_data.pop('location', None)

        user = UserSerializer().create(user_data)
        location = None
        if location_data:
            location = LocationSerializer().create(location_data)

        donor = DonorProfile.objects.create(user=user, location=location, **validated_data)
        return donor

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        location_data = validated_data.pop('location', None)

        if user_data:
            UserSerializer().update(instance.user, user_data)
        if location_data:
            if instance.location:
                LocationSerializer().update(instance.location, location_data)
            else:
                instance.location = LocationSerializer().create(location_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class DonationRecordSerializer(serializers.ModelSerializer):
    donor = DonorProfileSerializer(required=False)
    collected_by = UserSerializer(required=False, allow_null=True)

    class Meta:
        model = DonationRecord
        fields = '__all__'
