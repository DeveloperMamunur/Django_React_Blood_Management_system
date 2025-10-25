from django.contrib import admin
from .models import DonorProfile, DonationRecord

# Register your models here.
admin.site.register(DonorProfile)
admin.site.register(DonationRecord)
