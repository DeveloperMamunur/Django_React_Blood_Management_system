from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from django.utils import timezone
from accounts.models import User
from locations.models import Location
import uuid

class DonorProfile(models.Model):
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
    
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor_profile')
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    date_of_birth = models.DateField(null=False, blank=False, default='1900-01-01')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('45.00'))],
        help_text="Weight in kg (minimum 45kg)"
    )
    last_donation_date = models.DateField(null=True, blank=True)
    medical_conditions = models.TextField(
        blank=True,
        help_text="Any medical conditions that might affect donation"
    )
    is_available = models.BooleanField(default=True, help_text="Available for donation")
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, related_name='donors')
    profile_photo = models.ImageField(upload_to='donor_profiles/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    willing_to_travel_km = models.PositiveIntegerField(default=10, help_text="Maximum distance willing to travel (in km)")
    preferred_donation_time = models.CharField(
        max_length=20,
        choices=(
            ('MORNING', 'Morning (8AM-12PM)'),
            ('AFTERNOON', 'Afternoon (12PM-5PM)'),
            ('EVENING', 'Evening (5PM-8PM)'),
            ('ANYTIME', 'Anytime'),
        ),
        default='ANYTIME'
    )
    total_donations = models.PositiveIntegerField(default=0)
    donation_points = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_donors')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donor_profiles'
        indexes = [
            models.Index(fields=['blood_group', 'is_available']),
            models.Index(fields=['location', 'blood_group']),
        ]
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.blood_group}"
    
    def can_donate(self):
        if not self.last_donation_date:
            return True
        days_since_last_donation = (timezone.now().date() - self.last_donation_date).days
        return days_since_last_donation >= 90
    
    def days_until_eligible(self):
        if not self.last_donation_date:
            return 0
        days_since = (timezone.now().date() - self.last_donation_date).days
        remaining = 90 - days_since
        return max(0, remaining)


class DonationRecord(models.Model):
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('REJECTED', 'Rejected'),
    )
    donation_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='donations')
    blood_bank = models.ForeignKey('bloodbanks.BloodBank', on_delete=models.CASCADE, related_name='donations')
    donation_date = models.DateTimeField()
    blood_group = models.CharField(max_length=3, choices=DonorProfile.BLOOD_GROUP_CHOICES)
    units_donated = models.DecimalField(max_digits=4, decimal_places=2, default=1.0, help_text="Units in pints")
    hemoglobin_level = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, help_text="Hemoglobin level in g/dL")
    blood_pressure = models.CharField(max_length=20, blank=True)
    temperature = models.DecimalField( max_digits=4, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    rejection_reason = models.TextField(blank=True)
    related_request = models.ForeignKey('bloodrequests.BloodRequest', on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    collected_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='collected_donations')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donation_records'
        ordering = ['-donation_date']
        indexes = [
            models.Index(fields=['donor', 'donation_date']),
            models.Index(fields=['status', 'donation_date']),
        ]
    
    def __str__(self):
        return f"Donation {self.donation_id} - {self.donor.user.get_full_name()}"