from rest_framework import serializers
from analytics.models import (
    DonationStatistics, ActivityLog,
    BloodRequestView, RequestViewStatistics
)
from accounts.serializers import UserSerializer


class DonationStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationStatistics
        fields = '__all__'


class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ActivityLog
        fields = '__all__'


class BloodRequestViewSerializer(serializers.ModelSerializer):
    viewer = UserSerializer(required=False, allow_null=True)

    class Meta:
        model = BloodRequestView
        fields = '__all__'


class RequestViewStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestViewStatistics
        fields = '__all__'
