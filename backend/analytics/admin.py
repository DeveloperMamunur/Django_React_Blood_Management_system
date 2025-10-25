from django.contrib import admin
from .models import DonationStatistics, ActivityLog, BloodRequestView, RequestViewStatistics,DistanceRecord

# Register your models here.
admin.site.register(DonationStatistics)
admin.site.register(ActivityLog)
admin.site.register(BloodRequestView)
admin.site.register(RequestViewStatistics)
admin.site.register(DistanceRecord)
