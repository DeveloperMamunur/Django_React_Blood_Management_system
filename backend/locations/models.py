from django.db import models
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import time
import logging

logger = logging.getLogger(__name__)

class Location(models.Model):
    address_line1 = models.CharField(max_length=255)
    police_station = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='Bangladesh')
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        help_text="Latitude coordinate"
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        help_text="Longitude coordinate"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'locations'
        indexes = [
            models.Index(fields=['police_station', 'city', 'state']),
            models.Index(fields=['latitude', 'longitude']),
        ]
    
    def __str__(self):
        return self.get_full_address()

    def get_full_address(self):
        parts = [
            self.address_line1,
            self.police_station,
            self.city,
            self.state,
            self.postal_code,
            self.country,
        ]
        return ", ".join([p for p in parts if p])

    def geocode_address(self, attempt=1, max_attempts=3):
        geolocator = Nominatim(user_agent="blood_management_system", timeout=10)
        address_variants = [
            f"{self.address_line1}, {self.police_station}, {self.city}, {self.country}",
            f"{self.police_station}, {self.city}, {self.country}",
            f"{self.city}, {self.country}",
        ]
        for full_address in address_variants:
            try:
                location = geolocator.geocode(full_address)
                if location:
                    self.latitude = location.latitude
                    self.longitude = location.longitude
                    print(f"✅ Geocoded using: {full_address}")
                    return True
            except Exception as e:
                print(f"⚠️ Geocoding failed for {full_address}: {e}")
                continue
        print(f"❌ Could not geocode any variant for: {self.get_full_address()}")
        return False

    def save(self, *args, **kwargs):
        if not self.latitude or not self.longitude:
            try:
                success = self.geocode_address()
                if not success:
                    logger.warning(f"⚠️ No coordinates found for: {self.get_full_address()}")
            except Exception as e:
                logger.error(f"💥 Failed to geocode during save: {e}")
        super().save(*args, **kwargs)

    @classmethod
    def geocode_all_missing(cls, delay_seconds=1):
        locations = cls.objects.filter(latitude__isnull=True, longitude__isnull=True)
        total = locations.count()
        logger.info(f"Starting batch geocoding for {total} locations...")

        for i, loc in enumerate(locations, start=1):
            success = loc.geocode_address()
            if success:
                loc.save(update_fields=['latitude', 'longitude'])
                logger.info(f"[{i}/{total}] ✅ Geocoded {loc.get_full_address()}")
            else:
                logger.warning(f"[{i}/{total}] ⚠️ Skipped {loc.get_full_address()}")
            time.sleep(delay_seconds)

        logger.info("✅ Batch geocoding complete.")