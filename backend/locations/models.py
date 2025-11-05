from django.db import models
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import time

class Location(models.Model):
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
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
            models.Index(fields=['city', 'state']),
            models.Index(fields=['latitude', 'longitude']),
        ]
    
    def __str__(self):
        return f"{self.address_line1},{self.city}, {self.state}"
    
    def get_full_address(self):
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        parts.extend([self.city, self.state, self.postal_code, self.country])
        return ", ".join(parts)

    def geocode_address(self, attempt=1, max_attempts=3):
        geolocator = Nominatim(user_agent="blood_management_system", timeout=10)
        
        full_address = f"{self.address_line1}, {self.city}, {self.state}, {self.postal_code}, {self.country}"
        
        try:
            location = geolocator.geocode(full_address)
            
            if location:
                self.latitude = location.latitude
                self.longitude = location.longitude
                print(f"Successfully geocoded: {full_address}")
                return True
            else:
                print(f"Warning: Could not geocode address: {full_address}")
                return False
                
        except GeocoderTimedOut:
            if attempt < max_attempts:
                print(f"Geocoding timeout, retry {attempt}/{max_attempts}")
                time.sleep(2)
                return self.geocode_address(attempt=attempt + 1, max_attempts=max_attempts)
            else:
                print(f"Geocoding failed after {max_attempts} attempts for: {full_address}")
                return False
                
        except GeocoderServiceError as e:
            print(f"Geocoding service error: {str(e)}")
            return False
            
        except Exception as e:
            print(f"Unexpected geocoding error: {str(e)}")
            return False

    def save(self, *args, **kwargs):
        if not self.latitude or not self.longitude:
            try:
                self.geocode_address()
            except Exception as e:
                print(f"Failed to geocode during save: {str(e)}")
        
        super().save(*args, **kwargs)
