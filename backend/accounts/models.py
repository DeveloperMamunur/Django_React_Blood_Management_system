from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from locations.models import Location
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('DONOR', 'Donor'),
        ('RECEIVER', 'Receiver'),
        ('HOSPITAL', 'Hospital'),
        ('BLOOD_BANK', 'Blood Bank Staff'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='DONOR')
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    email_verified = models.BooleanField(default=False)
    is_active_account = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_users'
    )

    
    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class AdminProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='admin_profile'
    )
    age = models.PositiveIntegerField()
    blood_group = models.CharField(
        max_length=3,
        choices=(
            ('A+', 'A+'), ('A-', 'A-'),
            ('B+', 'B+'), ('B-', 'B-'),
            ('AB+', 'AB+'), ('AB-', 'AB-'),
            ('O+', 'O+'), ('O-', 'O-'),
        ),
        blank=True
    )
    location = models.ForeignKey(
        Location, on_delete=models.SET_NULL, null=True, related_name='admins'
    )
    contact_number = models.CharField(max_length=17, blank=True)
    emergency_contact = models.CharField(max_length=17, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admin_profiles'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name()} ({self.user.username})"

    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

class ReceiverProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='receiver_profile'
    )
    age = models.PositiveIntegerField()
    blood_group = models.CharField(
        max_length=3,
        choices=(
            ('A+', 'A+'), ('A-', 'A-'),
            ('B+', 'B+'), ('B-', 'B-'),
            ('AB+', 'AB+'), ('AB-', 'AB-'),
            ('O+', 'O+'), ('O-', 'O-'),
        ),
        blank=True
    )
    location = models.ForeignKey(
        Location, on_delete=models.SET_NULL, null=True, related_name='receivers'
    )
    contact_number = models.CharField(max_length=17, blank=True)
    emergency_contact = models.CharField(max_length=17, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'receiver_profiles'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name()} ({self.user.username})"

    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"


class HospitalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hospital_profile')
    hospital_name = models.CharField(max_length=255, blank=True)
    registration_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    hospital_type = models.CharField(
        max_length=20,
        choices=(
            ('GOVERNMENT', 'Government'),
            ('PRIVATE', 'Private'),
            ('CHARITABLE', 'Charitable'),
        ),
        blank=True
    )
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    emergency_contact = models.CharField(max_length=17, blank=True)
    website = models.URLField(blank=True, null=True)
    has_blood_bank = models.BooleanField(default=False)
    bed_capacity = models.PositiveIntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    license_document = models.FileField(upload_to='hospital_licenses/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'hospital_profiles'
    
    def __str__(self):
        return self.hospital_name