from django.contrib import admin
from .models import BloodDriveCampaign, CampaignRegistration

# Register your models here.
admin.site.register(BloodDriveCampaign)
admin.site.register(CampaignRegistration)