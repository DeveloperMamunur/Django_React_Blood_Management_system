from django.contrib import admin
from .models import User, ReceiverProfile, HospitalProfile, AdminProfile

# Register your models here.
admin.site.register(User)
admin.site.register(ReceiverProfile)
admin.site.register(HospitalProfile)
admin.site.register(AdminProfile)
