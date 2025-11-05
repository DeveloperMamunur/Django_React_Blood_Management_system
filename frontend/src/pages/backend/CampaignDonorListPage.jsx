import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Loader2, Droplet, Clock, FileText, ArrowLeftFromLine } from "lucide-react";
import { campaignService } from "../../services/campaignService";
import { useParams, Link} from "react-router-dom";
export default function CampaignDonorListPage() {
  const { campaignId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchCampaignsDonors = async (id) => {
      try {
        setLoading(true);
        setError(null);
        const res = await campaignService.getCampaignRegistrationDonors(id);
        console.log(res.results);
        setRegistrations(res.results || []);
      } catch (error) {
        console.error("Error fetching campaign donors:", error);
        setError("Failed to load registered donors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaign= async (id) => {
        try {
            setLoading(true);
            setError(null);
            const res = await campaignService.currentCampaign(id);
            console.log(res); 
            setCampaign(res || null);
        } catch (error) {
            console.error("Error fetching campaign:", error);
            setError("Failed to load campaign. Please try again later.");
        } finally {
            setLoading(false);
        }
      };
    if (campaignId) {
      fetchCampaignsDonors(campaignId);
      fetchCampaign(campaignId);
    }
  }, [campaignId]);

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      "A+": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      "A-": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      "B+": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "B-": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "AB+": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "AB-": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "O+": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "O-": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    };
    return colors[bloodGroup] || "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  };


  const getStatusColor = (status) => {
    const colors = {
      "REGISTERED": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "CONFIRMED": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "COMPLETED": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "CANCELLED": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    };
    return colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };
    

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
            { campaign && campaign.campaign_name }
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Campaign ID: {campaignId}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-center text-xl font-bold mb-4">
            Registration List
          </p>
        </div>
        <div className="flex justify-end items-center mb-4">
            <Link  to="/dashboard/campaigns" className="font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 active:scale-95 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 focus:ring-purple-500/50 px-4 py-2 text-sm "><ArrowLeftFromLine className="w-6 h-6" />Back to Campaigns</Link>
        </div>

        {/* Stats Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Registered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{registrations.length}</p>
                </div>
                <User className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blood Groups</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(registrations.map(r => r.donor.blood_group)).size}
                  </p>
                </div>
                <Droplet className="w-10 h-10 text-red-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Donations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {registrations.reduce((sum, r) => sum + (r.donor.total_donations || 0), 0)}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Status</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {registrations.filter(r => r.status === 'REGISTERED').length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && registrations.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Registered Donors Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No donors have registered for this campaign yet.
            </p>
          </div>
        )}

        {/* Registration List */}
        {!loading && !error && registrations.length > 0 && (
          <div className="space-y-4">
            {registrations
            .map((registration) => {
                const donor = registration.donor;
                const user = donor.user;
                const location = donor.location;
                const campaignLocation = registration.campaign?.location;
                const distance =
                    campaignLocation?.latitude && location?.latitude
                        ? calculateDistance(
                            parseFloat(campaignLocation.latitude),
                            parseFloat(campaignLocation.longitude),
                            parseFloat(location.latitude),
                            parseFloat(location.longitude)
                        )
                        : "N/A";
              return (
                <div key={registration.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Left: Avatar and Basic Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="shrink-0 w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.first_name} {user.last_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBloodGroupColor(donor.blood_group)}`}>
                            <Droplet className="w-3 h-3 inline mr-1" />
                            {donor.blood_group}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.status)}`}>
                            {registration.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{location.address_line1}, {location.city}, {location.state}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Additional Details */}
                    <div className="md:w-80 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{donor.gender}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Weight</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{donor.weight} kg</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Donations</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{donor.total_donations}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Donation</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    {/* ✅ Distance added */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Distance</p>
                        <p className="text-sm font-semibold">{distance} km</p>
                      </div>
                      {registration.preferred_time_slot && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-900 dark:text-blue-100">
                              <strong>Preferred Time:</strong> {registration.preferred_time_slot}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>Registered: {formatDate(registration.registered_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Notes Section */}
                  {registration.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{registration.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}