from django.contrib import admin
from .models import BloodBank, BloodInventory

# Register your models here.
admin.site.register(BloodBank)
admin.site.register(BloodInventory)