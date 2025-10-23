from django.db import models
from accounts.models import User

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = (
        ('DONATION_APPROVED', 'Donation Approved'),
        ('DONATION_REJECTED', 'Donation Rejected'),
        ('BLOOD_NEEDED', 'Blood Needed'),
        ('REQUEST_APPROVED', 'Request Approved'),
        ('REQUEST_FULFILLED', 'Request Fulfilled'),
        ('LOW_STOCK_ALERT', 'Low Stock Alert'),
        ('ELIGIBILITY_REMINDER', 'Eligibility Reminder'),
        ('GENERAL', 'General'),
    )
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    related_request = models.ForeignKey('bloodrequests.BloodRequest', on_delete=models.SET_NULL, null=True, blank=True)
    related_donation = models.ForeignKey('donors.DonationRecord', on_delete=models.SET_NULL, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    email_sent = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.username}"

    def mark_as_read(self):
        self.is_read = True
        self.read_at = timezone.now()
        self.save(update_fields=['is_read', 'read_at'])