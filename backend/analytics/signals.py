from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.db.models.signals import post_save
from django.dispatch import receiver, Signal
from analytics.models import ActivityLog
from bloodrequests.models import BloodRequest
from bloodbanks.models import BloodInventory
from django.utils import timezone


request_created_signal = Signal()
inventory_updated_signal = Signal()

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    ActivityLog.objects.create(
        user=user,
        action='USER_LOGIN',
        description=f"User '{user.username}' logged in successfully.",
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        metadata={
            "timestamp": timezone.now().isoformat(),
            "role": user.role if hasattr(user, 'role') else None,
        }
    )


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user and user.is_authenticated:
        ActivityLog.objects.create(
            user=user,
            action='USER_LOGOUT',
            description=f"User '{user.username}' logged out.",
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            metadata={"timestamp": timezone.now().isoformat()},
        )


@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    ActivityLog.objects.create(
        user=None,
        action='USER_LOGIN_FAILED',
        description=f"Failed login attempt for username '{credentials.get('username')}'.",
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        metadata={
            "timestamp": timezone.now().isoformat(),
            "username": credentials.get('username'),
        },
    )

@receiver(request_created_signal)
def log_request_created(sender, request, blood_request, **kwargs):
    user = getattr(request, "user", None)
    ActivityLog.objects.create(
        user=user,
        action='REQUEST_CREATED',
        description=f"New blood request created by user '{user.username if user else 'Unknown'}'.",
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        metadata={
            "timestamp": timezone.now().isoformat(),
            "request_id": str(blood_request.id),
        },
    )

@receiver(inventory_updated_signal)
def log_inventory_updated(sender, **kwargs):
    inventory = kwargs.get('inventory')
    request = kwargs.get('request') 

    if not inventory:
        return

    ip_address = None
    user_agent = None
    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        ip_address = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')

    ActivityLog.objects.create(
        user=inventory.blood_bank.managed_by,
        action='INVENTORY_UPDATED',
        description=f"Inventory of blood bank '{inventory.blood_bank.name}' updated.",
        ip_address=ip_address,
        user_agent=user_agent,
        metadata={
            "timestamp": timezone.now().isoformat(),
            "blood_bank_id": inventory.blood_bank.id,
        },
    )


