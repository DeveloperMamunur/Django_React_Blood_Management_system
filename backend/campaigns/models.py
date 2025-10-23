from django.db import models
from accounts.models import User
from locations.models import Location

class BloodDriveCampaign(models.Model):
    STATUS_CHOICES = (
        ('PLANNED', 'Planned'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )
    
    campaign_name = models.CharField(max_length=255)
    description = models.TextField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_campaigns')
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    venue_details = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    target_donors = models.PositiveIntegerField(default=100)
    registered_donors = models.ManyToManyField('donors.DonorProfile', through='CampaignRegistration', related_name='campaigns')
    blood_banks_involved = models.ManyToManyField( 'bloodbanks.BloodBank', related_name='campaigns')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNED')
    banner_image = models.ImageField(upload_to='campaign_banners/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blood_drive_campaigns'
        ordering = ['-start_date']
    
    def __str__(self):
        return self.campaign_name

    def registration_count(self):
        return self.registered_donors.count()

    def completion_rate(self):
        total = self.registered_donors.count()
        donated = self.campaignregistration_set.filter(status='DONATED').count()
        return (donated / total * 100) if total else 0


class CampaignRegistration(models.Model):
    STATUS_CHOICES = (
        ('REGISTERED', 'Registered'),
        ('ATTENDED', 'Attended'),
        ('DONATED', 'Donated'),
        ('NO_SHOW', 'No Show'),
        ('CANCELLED', 'Cancelled'),
    )
    
    campaign = models.ForeignKey(BloodDriveCampaign, on_delete=models.CASCADE)
    donor = models.ForeignKey('donors.DonorProfile', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REGISTERED')
    registered_at = models.DateTimeField(auto_now_add=True)
    preferred_time_slot = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'campaign_registrations'
        unique_together = ('campaign', 'donor')
    
    def __str__(self):
        return f"{self.donor.user.username} - {self.campaign.campaign_name}"
