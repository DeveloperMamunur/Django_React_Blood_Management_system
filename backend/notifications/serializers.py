from rest_framework import serializers
from notifications.models import Notification
from accounts.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserSerializer()

    class Meta:
        model = Notification
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('recipient')
        user = UserSerializer().create(user_data)
        return Notification.objects.create(recipient=user, **validated_data)
