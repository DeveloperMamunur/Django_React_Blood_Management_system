from rest_framework import serializers
from donors.models import DonorProfile, DonationRecord
from accounts.serializers import UserSerializer
from locations.serializers import LocationSerializer
from accounts.models import User
from locations.models import Location


class DonorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)

    class Meta:
        model = DonorProfile
        fields = '__all__'
        read_only_fields = ['user', 'total_donations', 'donation_points', 'is_verified', 'verified_at', 'verified_by']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        location_data = validated_data.pop('location', None)
        location = None
        if location_data:
            location = Location.objects.create(**location_data)

        donor, created = DonorProfile.objects.update_or_create(
            user=user,
            defaults={**validated_data, 'location': location}
        )
        return donor

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        request = self.context.get('request')
        user_data = request.data.get('user') if request else None
        if user_data:
            for attr in ['first_name', 'last_name', 'phone_number']:
                if attr in user_data:
                    setattr(instance.user, attr, user_data[attr])
            instance.user.save()

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
        read_only_fields = ['donor', 'collected_by']

    def create(self, validated_data):
        collected_by = self.context['request'].user if self.context['request'].user.is_authenticated else None
        validated_data['collected_by'] = collected_by
        return super().create(validated_data)

