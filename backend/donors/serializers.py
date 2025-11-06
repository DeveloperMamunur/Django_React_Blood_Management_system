from rest_framework import serializers
from donors.models import DonorProfile, DonationRecord
from accounts.serializers import UserSerializer
from locations.serializers import LocationSerializer
from accounts.models import User
from locations.models import Location


class DonorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)
    total_donations = serializers.IntegerField(read_only=True)
    donation_points = serializers.IntegerField(read_only=True)
    can_donate = serializers.SerializerMethodField()
    days_until_eligible = serializers.SerializerMethodField()

    class Meta:
        model = DonorProfile
        fields = '__all__'
        read_only_fields = ['user', 'is_verified', 'verified_at', 'verified_by']

    def get_can_donate(self, obj):
        return obj.is_available and obj.can_donate()
        
    def get_days_until_eligible(self, obj):
        return obj.days_until_eligible()

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        location_data = validated_data.pop('location', None)
        location = None
        if location_data:
            location_serializer = LocationSerializer(data=location_data)
            location_serializer.is_valid(raise_exception=True)
            location = location_serializer.save()

        donor = DonorProfile.objects.create(
            user=user,
            location=location,
            **validated_data
        )
        return donor

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)

        if location_data:
            if instance.location:
                location_serializer = LocationSerializer(
                    instance.location, data=location_data, partial=True
                )
                location_serializer.is_valid(raise_exception=True)
                location_serializer.save()
            else:
                location_serializer = LocationSerializer(data=location_data)
                location_serializer.is_valid(raise_exception=True)
                instance.location = location_serializer.save()
        
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

