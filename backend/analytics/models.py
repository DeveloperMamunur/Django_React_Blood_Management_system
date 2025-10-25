from django.db import models
from accounts.models import User
from bloodrequests.models import BloodRequest
from bloodbanks.models import BloodBank
from django.utils import timezone
from django.db.models import Count

class DonationStatistics(models.Model):
    date = models.DateField(unique=True)
    total_donations = models.PositiveIntegerField(default=0)
    total_requests = models.PositiveIntegerField(default=0)
    fulfilled_requests = models.PositiveIntegerField(default=0)
    new_donors = models.PositiveIntegerField(default=0)
    donations_by_group = models.JSONField(default=dict)
    requests_by_group = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donation_statistics'
        ordering = ['-date']
    
    def __str__(self):
        return f"Statistics for {self.date}"


class ActivityLog(models.Model):
    ACTION_CHOICES = (
        ('USER_REGISTERED', 'User Registered'),
        ('USER_LOGIN', 'User Login'),
        ('USER_LOGOUT', 'User Logout'),
        ('USER_LOGIN_FAILED', 'User Login Failed'),
        ('DONOR_VERIFIED', 'Donor Verified'),
        ('REQUEST_CREATED', 'Request Created'),
        ('REQUEST_APPROVED', 'Request Approved'),
        ('DONATION_COMPLETED', 'Donation Completed'),
        ('INVENTORY_UPDATED', 'Inventory Updated'),
        ('CAMPAIGN_CREATED', 'Campaign Created'),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='activity_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['action', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.user.username if self.user else 'System'}"

class BloodRequestView(models.Model):
    blood_request = models.ForeignKey('bloodrequests.BloodRequest', on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='viewed_requests')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_key = models.CharField(max_length=100, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'blood_request_views'
        verbose_name = "Blood Request View"
        verbose_name_plural = "Blood Request Views"
        unique_together = ('blood_request', 'session_key')
        indexes = [
            models.Index(fields=['blood_request', 'viewed_at']),
            models.Index(fields=['viewer']),
        ]

    def __str__(self):
        return f"View of {self.blood_request} at {self.viewed_at}"


class RequestViewStatistics(models.Model):
    date = models.DateField(default=timezone.now)
    total_views = models.PositiveIntegerField(default=0)
    top_requests = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'request_view_statistics'
        ordering = ['-date']
        verbose_name = "Blood Request View Statistic"
        verbose_name_plural = "Blood Request View Statistics"

    def __str__(self):
        return f"View Stats ({self.date})"

    @classmethod
    def generate_daily_stats(cls):
        today = timezone.now().date()
        start = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.min.time()))
        end = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.max.time()))
        total_views = BloodRequestView.objects.filter(viewed_at__range=(start, end)).count()
        top_requests_qs = (
            BloodRequestView.objects.filter(viewed_at__range=(start, end))
            .values('blood_request__id', 'blood_request__request_id', 'blood_request__patient_name')
            .annotate(view_count=Count('id'))
            .order_by('-view_count')[:5]
        )

        top_requests = [
            {
                "id": r["blood_request__id"],
                "request_id": r["blood_request__request_id"],
                "patient_name": r["blood_request__patient_name"],
                "views": r["view_count"],
            }
            for r in top_requests_qs
        ]

        obj, _ = cls.objects.update_or_create(
            date=today,
            defaults={"total_views": total_views, "top_requests": top_requests},
        )
        return obj



class DistanceRecord(models.Model):
    blood_request = models.ForeignKey('bloodrequests.BloodRequest', on_delete=models.CASCADE, null=True, blank=True)
    receiver = models.ForeignKey(User, related_name='distance_as_receiver', on_delete=models.CASCADE, null=True, blank=True)
    donor = models.ForeignKey(User, related_name='distance_as_donor', on_delete=models.CASCADE, null=True, blank=True)
    hospital = models.ForeignKey(User, related_name='distance_as_hospital', on_delete=models.CASCADE, null=True, blank=True)
    blood_bank = models.ForeignKey(BloodBank, on_delete=models.SET_NULL, null=True, blank=True) 
    receiver_to_donor_km = models.FloatField(null=True, blank=True)
    receiver_to_hospital_km = models.FloatField(null=True, blank=True)
    donor_to_hospital_km = models.FloatField(null=True, blank=True)
    receiver_to_bloodbank_km = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Distance Record"
        verbose_name_plural = "Distance Records"
        ordering = ['-created_at']

    def __str__(self):
        return f"Receiver {self.receiver} | Donor {self.donor} | {self.created_at.strftime('%Y-%m-%d %H:%M')}"