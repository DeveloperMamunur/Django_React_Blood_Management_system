from django.db import models
from accounts.models import User
from locations.models import Location

class BloodBank(models.Model):
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=17)
    email = models.EmailField()
    operating_hours = models.CharField(max_length=100, default="24/7")
    storage_capacity = models.PositiveIntegerField(help_text="Maximum units that can be stored")
    managed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_blood_banks')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blood_banks'
    
    def __str__(self):
        return f"{self.name} - {self.location.city}"
    
    def get_total_units(self):
        return self.inventory.aggregate(
            total=models.Sum('units_available')
        )['total'] or 0


class BloodInventory(models.Model):
    BLOOD_GROUP_CHOICES = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    )
    
    blood_bank = models.ForeignKey(BloodBank, on_delete=models.CASCADE, related_name='inventory')
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    units_available = models.PositiveIntegerField(default=0)
    units_reserved = models.PositiveIntegerField(default=0)
    minimum_threshold = models.PositiveIntegerField(default=10, help_text="Alert when units fall below this number")
    critical_threshold = models.PositiveIntegerField(default=5, help_text="Critical alert threshold")
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blood_inventory'
        unique_together = ('blood_bank', 'blood_group')
        indexes = [
            models.Index(fields=['blood_group', 'units_available']),
        ]
    
    def __str__(self):
        return f"{self.blood_bank.name} - {self.blood_group}: {self.units_available} units"
    
    def is_low_stock(self):
        return self.units_available < self.minimum_threshold
    
    def is_critical_stock(self):
        return self.units_available < self.critical_threshold