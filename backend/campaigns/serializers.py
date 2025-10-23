from rest_framework import serializers
from campaigns.models import BloodDriveCampaign, CampaignRegistration
from accounts.serializers import UserSerializer
from donors.serializers import DonorProfileSerializer
from bloodbanks.serializers import BloodBankSerializer
from locations.serializers import LocationSerializer


class CampaignRegistrationSerializer(serializers.ModelSerializer):
    donor = DonorProfileSerializer()

    class Meta:
        model = CampaignRegistration
        fields = '__all__'

    def create(self, validated_data):
        donor_data = validated_data.pop('donor')
        donor = DonorProfileSerializer().create(donor_data)
        return CampaignRegistration.objects.create(donor=donor, **validated_data)


class BloodDriveCampaignSerializer(serializers.ModelSerializer):
    organizer = UserSerializer()
    location = LocationSerializer()
    registered_donors = DonorProfileSerializer(many=True, read_only=True)
    blood_banks_involved = BloodBankSerializer(many=True, read_only=True)

    class Meta:
        model = BloodDriveCampaign
        fields = '__all__'

    def create(self, validated_data):
        organizer_data = validated_data.pop('organizer')
        location_data = validated_data.pop('location')

        organizer = UserSerializer().create(organizer_data)
        location = LocationSerializer().create(location_data)

        return BloodDriveCampaign.objects.create(organizer=organizer, location=location, **validated_data)
