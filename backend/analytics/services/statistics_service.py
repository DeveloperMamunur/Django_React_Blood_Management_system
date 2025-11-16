from datetime import date
from django.db.models import Count
from donors.models import DonorProfile
from bloodrequests.models import BloodRequest
from donors.models import DonationRecord
from analytics.models import DonationStatistics

def generate_daily_statistics(target_date=None):
    if target_date is None:
        target_date = date.today()

    # Count donations for the day
    donations = DonationRecord.objects.filter(
        donation_date__date=target_date,
        status="COMPLETED"
    )
    total_donations = donations.count()

    # Donations grouped by blood group
    donations_by_group = donations.values("blood_group").annotate(
        total=Count("id")
    )

    donations_by_group_dict = {x["blood_group"]: x["total"] for x in donations_by_group}

    # Count requests
    requests = BloodRequest.objects.filter(created_at__date=target_date)
    total_requests = requests.count()

    requests_by_group = requests.values("blood_group").annotate(
        total=Count("id")
    )
    requests_by_group_dict = {x["blood_group"]: x["total"] for x in requests_by_group}

    # Fulfilled Requests
    fulfilled_requests = requests.filter(status="FULFILLED").count()

    # New donor registrations
    new_donors = DonorProfile.objects.filter(
        created_at__date=target_date
    ).count()

    # Save or update the statistics object
    stats, created = DonationStatistics.objects.update_or_create(
        date=target_date,
        defaults={
            "total_donations": total_donations,
            "total_requests": total_requests,
            "fulfilled_requests": fulfilled_requests,
            "new_donors": new_donors,
            "donations_by_group": donations_by_group_dict,
            "requests_by_group": requests_by_group_dict,
        }
    )

    return stats
