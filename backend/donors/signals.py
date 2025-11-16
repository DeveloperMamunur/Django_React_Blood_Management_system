from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from donors.models import DonationRecord
from analytics.services.statistics_service import generate_daily_statistics


@receiver(pre_save, sender=DonationRecord)
def check_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return 

    old = DonationRecord.objects.get(pk=instance.pk)

    if old.status != instance.status and instance.status == "COMPLETED":
        day = instance.donation_date.date()
        generate_daily_statistics(day)