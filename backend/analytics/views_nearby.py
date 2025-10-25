from rest_framework import generics, permissions
from rest_framework.response import Response
from donors.models import DonorProfile
from accounts.models import HospitalProfile
from bloodbanks.models import BloodBank
from common.utils.distance import calculate_distance
from analytics.models import DistanceRecord

class NearbyEntitiesView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not hasattr(user, 'receiver_profile'):
            return Response({"error": "Only receivers can access this endpoint."}, status=400)

        receiver_loc = user.receiver_profile.location
        receiver_lat = receiver_loc.latitude
        receiver_lon = receiver_loc.longitude

        # Collect nearby donors
        donors = [
            {
                "type": "Donor",
                "id": donor.id,
                "name": donor.user.get_full_name(),
                "blood_group": donor.blood_group,
                "distance_km": calculate_distance(receiver_lat, receiver_lon, donor.location.latitude, donor.location.longitude)
            }
            for donor in DonorProfile.objects.select_related('user', 'location')
        ]

        # Collect nearby hospitals
        hospitals = [
            {
                "type": "Hospital",
                "id": hospital.id,
                "name": hospital.hospital_name,
                "distance_km": calculate_distance(receiver_lat, receiver_lon, hospital.location.latitude, hospital.location.longitude)
            }
            for hospital in HospitalProfile.objects.select_related('location')
        ]

        # Collect nearby blood banks
        banks = [
            {
                "type": "Blood Bank",
                "id": bank.id,
                "name": bank.name,
                "distance_km": calculate_distance(receiver_lat, receiver_lon, bank.location.latitude, bank.location.longitude)
            }
            for bank in BloodBank.objects.select_related('location')
        ]

        # Combine all
        combined = donors + hospitals + banks
        combined = sorted(combined, key=lambda x: x['distance_km'])

        # Store nearest distances
        if combined:
            nearest_donor = next((d for d in combined if d["type"] == "Donor"), None)
            nearest_hospital = next((h for h in combined if h["type"] == "Hospital"), None)
            nearest_bank = next((b for b in combined if b["type"] == "Blood Bank"), None)

            DistanceRecord.objects.create(
                receiver=user,
                donor=nearest_donor and DonorProfile.objects.get(id=nearest_donor["id"]).user,
                hospital=nearest_hospital and HospitalProfile.objects.get(id=nearest_hospital["id"]).user,
                blood_bank=nearest_bank and BloodBank.objects.get(id=nearest_bank["id"]),
                receiver_to_donor_km=nearest_donor and nearest_donor["distance_km"],
                receiver_to_hospital_km=nearest_hospital and nearest_hospital["distance_km"],
                receiver_to_bloodbank_km=nearest_bank and nearest_bank["distance_km"],
            )

        return Response({
            "receiver": user.get_full_name(),
            "location": {"latitude": receiver_lat, "longitude": receiver_lon},
            "nearby": combined
        })
