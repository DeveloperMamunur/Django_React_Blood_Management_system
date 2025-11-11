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
    location = LocationSerializer()
    blood_banks_involved = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BloodBank.objects.all(), required=False
    )
    registrations = serializers.SerializerMethodField()
    registration_count = serializers.IntegerField(read_only=True)
    completion_rate = serializers.SerializerMethodField()
    class Meta:
        model = BloodDriveCampaign
        fields = "__all__"
        read_only_fields = ["organizer", "created_at", "updated_at"]
    
    def get_registrations(self, obj):
        return obj.get_registrations().count()

    def get_completion_rate(self, obj):
        return round(obj.completion_rate(), 2)

    def create(self, validated_data):
        location_data = validated_data.pop("location")
        blood_banks = validated_data.pop("blood_banks_involved", [])
        banner_image = validated_data.pop("banner_image", None)
        location = Location.objects.create(**location_data)
        campaign = BloodDriveCampaign.objects.create(location=location, **validated_data)

        if banner_image:
            campaign.banner_image = banner_image
        campaign.save()

        if blood_banks:
            campaign.blood_banks_involved.set(blood_banks)

        return campaign

    def update(self, instance, validated_data):
        location_data = validated_data.pop("location", None)
        blood_banks = validated_data.pop("blood_banks_involved", None)

        if location_data:
            if instance.location:
                for key, value in location_data.items():
                    setattr(instance.location, key, value)
                instance.location.save()
            else:
                instance.location = Location.objects.create(**location_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if blood_banks is not None:
            instance.blood_banks_involved.set(blood_banks)

        instance.save()
        return instance

class CampaignListSerializer(serializers.ModelSerializer):

    address_line1 = serializers.CharField(source='location.address_line1', read_only=True)
    city = serializers.CharField(source='location.city', read_only=True)
    registrations = serializers.SerializerMethodField()

    class Meta:
        model = BloodDriveCampaign
        fields = ['id', 'campaign_name', 'start_date', 'end_date', 'target_donors', 'address_line1', 'city', 'status', 'banner_image','venue_details', 'registrations']

    def get_registrations(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        if getattr(user, "role", None) != "DONOR":
            return False

        donor = getattr(user, "donor_profile", None)
        if donor is None:
            return False
            
        return CampaignRegistration.objects.filter(
            campaign=obj,
            donor=donor
        ).exists()



class CampaignRegistrationSerializer(serializers.ModelSerializer):
    donor = DonorProfileSerializer(read_only=True)
    campaign = BloodDriveCampaignSerializer(read_only=True)

    class Meta:
        model = CampaignRegistration
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        donor = user.donor_profile
        campaign_id = self.context.get('campaign_id') or validated_data.get('campaign')

        if not campaign_id:
            raise serializers.ValidationError({"campaign": "Campaign ID is required."})

        try:
            campaign = BloodDriveCampaign.objects.get(pk=campaign_id)
        except BloodDriveCampaign.DoesNotExist:
            raise serializers.ValidationError({"campaign": "Invalid campaign ID."})

        if CampaignRegistration.objects.filter(campaign=campaign, donor=donor).exists():
            raise serializers.ValidationError("You have already registered for this campaign.")

        return CampaignRegistration.objects.create(
            campaign=campaign,
            donor=donor,
            preferred_time_slot=validated_data.get("preferred_time_slot", ""),
            notes=validated_data.get("notes", "")
        )
