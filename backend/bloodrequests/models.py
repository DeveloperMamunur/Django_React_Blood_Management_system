from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from accounts.models import User, HospitalProfile
from locations.models import Location
from bloodbanks.models import BloodBank
import uuid


class BloodRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('FULFILLED', 'Fulfilled'),
        ('CANCELLED', 'Cancelled'),
        ('REJECTED', 'Rejected'),
    )

    URGENCY_CHOICES = (
        ('ROUTINE', 'Routine'),
        ('URGENT', 'Urgent'),
        ('EMERGENCY', 'Emergency'),
    )

    REQUESTER_TYPE_CHOICES = (
        ('HOSPITAL', 'Hospital'),
        ('RECEIVER', 'Receiver'),
    )

    BLOOD_GROUP_CHOICES = (
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    )

    request_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    requester_type = models.CharField(max_length=20, choices=REQUESTER_TYPE_CHOICES)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_requests')
    patient_name = models.CharField(max_length=255)
    patient_age = models.PositiveIntegerField(validators=[MaxValueValidator(150)])
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    units_required = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    reason = models.TextField(help_text="Reason for blood requirement")
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='ROUTINE')
    required_by_date = models.DateTimeField()
    hospital = models.ForeignKey(HospitalProfile, on_delete=models.SET_NULL, null=True, blank=True)
    hospital_name = models.CharField(max_length=255, blank=True, help_text="Provide hospital name if it is not registered")
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_requests')
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    assigned_blood_bank = models.ForeignKey(BloodBank, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blood_requests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'urgency']),
            models.Index(fields=['blood_group', 'status']),
        ]

    def __str__(self):
        return f"{self.blood_group} ({self.get_urgency_display()}) - {self.requester_type}"

    def is_overdue(self):
        return timezone.now() > self.required_by_date and self.status == 'PENDING'

    def is_urgent(self):
        return self.urgency in ['URGENT', 'EMERGENCY']

    def save(self, *args, **kwargs):
        if not self.location:
            if self.requester_type == 'RECEIVER':
                receiver_profile = getattr(self.requested_by, 'receiver_profile', None)
                if receiver_profile and receiver_profile.location:
                    self.location = receiver_profile.location
            elif self.requester_type == 'HOSPITAL':
                hospital_profile = getattr(self.requested_by, 'hospital_profile', None)
                if hospital_profile and hospital_profile.location:
                    self.location = hospital_profile.location

        if self.hospital and not self.hospital_name:
            self.hospital_name = self.hospital.hospital_name

        super().save(*args, **kwargs)

    def clean(self):
        if not self.hospital and not self.hospital_name:
            raise ValidationError("Provide either a registered hospital or a hospital name.")