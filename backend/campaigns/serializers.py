from rest_framework import serializers
from campaigns.models import BloodDriveCampaign, CampaignRegistration
from accounts.serializers import UserSerializer
from donors.serializers import DonorProfileSerializer
from bloodbanks.serializers import BloodBankSerializer
from locations.serializers import LocationSerializer
from locations.models import Location
from bloodbanks.models import BloodBank
from rest_framework.exceptions import ValidationError
import json


class BloodDriveCampaignSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    location = LocationSerializer(required=False, allow_null=True)
    blood_banks_involved = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=BloodBank.objects.all()
    )
    banner_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = BloodDriveCampaign
        fields = '__all__'
        extra_kwargs = {
            'organizer': {'read_only': True},
        }

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        validated_data.pop('organizer', None)
        location_data = validated_data.pop('location', None)
        if isinstance(location_data, str):
            try:
                location_data = json.loads(location_data)
            except json.JSONDecodeError:
                raise ValidationError({'location': 'Invalid JSON format.'})

        blood_banks = validated_data.pop('blood_banks_involved', [])

        if not location_data:
            raise ValidationError({'location': 'This field is required.'})
        location = Location.objects.create(**location_data)

        campaign = BloodDriveCampaign.objects.create(
            organizer=user,
            location=location,
            **validated_data
        )

        if blood_banks:
            campaign.blood_banks_involved.set(blood_banks)

        return campaign

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        blood_banks = validated_data.pop('blood_banks_involved', None)
        banner_image = validated_data.pop('banner_image', None)

        if isinstance(location_data, str):
            try:
                location_data = json.loads(location_data)
            except json.JSONDecodeError:
                raise ValidationError({'location': 'Invalid JSON format.'})

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        if blood_banks is not None:
            instance.blood_banks_involved.set(blood_banks)

        if banner_image:
            instance.banner_image = banner_image

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class CampaignRegistrationSerializer(serializers.ModelSerializer):
    donor = DonorProfileSerializer(read_only=True)
    campaign = BloodDriveCampaignSerializer(read_only=True)

    class Meta:
        model = CampaignRegistration
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        donor = user.donor_profile
        campaign_id = self.context['request'].data.get('campaign')

        if not campaign_id:
            raise serializers.ValidationError({"campaign": "Campaign ID is required."})

        try:
            campaign = BloodDriveCampaign.objects.get(pk=campaign_id)
        except BloodDriveCampaign.DoesNotExist:
            raise serializers.ValidationError({"campaign": "Invalid campaign ID."})

        if CampaignRegistration.objects.filter(campaign=campaign, donor=donor).exists():
            raise serializers.ValidationError("You have already registered for this campaign.")

        return CampaignRegistration.objects.create(campaign=campaign, donor=donor, **validated_data)
