import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, ExternalLink, Clock, XCircle, UserPlus, RouteIcon} from 'lucide-react';
import { campaignService } from '../../../services/campaignService';
import { useAuth } from '../../../hooks/useAuth';
import { donorService } from '../../../services/donorService';

export default function CampaignListForDonor() {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDonor, setCurrentDonor] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await campaignService.allCampaigns();
        setCampaigns(res.results || res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentDonors = async () => {
      try {
        setLoading(true);
        setError(null);
        const resDonor = await donorService.currentDonor();
        const donorData = resDonor.results || resDonor;

        if (donorData) {
          setCurrentDonor(donorData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load donor profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentDonors();
  }, []);


  const getProgressPercentage = (registered, max) => {
    return Math.min((registered / max) * 100, 100);
  };

  const getStatusConfig = (status) => {
    const configs = {
      ACTIVE: {
        label: 'Active',
        bgColor: 'bg-green-100 dark:bg-green-900/40',
        textColor: 'text-green-700 dark:text-green-400',
        icon: CheckCircle
      },
      PLANNED: {
        label: 'Upcoming',
        bgColor: 'bg-gray-100 dark:bg-gray-900/40',
        textColor: 'text-blue-700 dark:text-blue-400',
        icon: Clock
      },
      COMPLETED: {
        label: 'Completed',
        bgColor: 'bg-gray-100 dark:bg-gray-700/50',
        textColor: 'text-gray-700 dark:text-gray-400',
        icon: CheckCircle
      },
      CANCELLED: {
        label: 'Cancelled',
        bgColor: 'bg-red-100 dark:bg-red-900/40',
        textColor: 'text-red-700 dark:text-red-400',
        icon: XCircle
      }
    };
    return configs[status] || configs.ACTIVE;
  };


  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const getDistanceToCampaign = (campaign) => {
    if (!currentDonor?.location?.latitude || !currentDonor?.location?.longitude || 
        !campaign.location?.latitude || !campaign.location?.longitude) {
      return null;
    }
    return calculateDistance(
      currentDonor.location.latitude,
      currentDonor.location.longitude,
      campaign.location.latitude,
      campaign.location.longitude
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDonor && currentUser.role === 'DONOR') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <UserPlus className="mx-auto text-red-500 dark:text-red-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Donor Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to create a donor profile before viewing campaigns.
          </p>
          <Link
            to="/dashboard/donor/profile"
            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition-colors"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back, {currentDonor?.user?.first_name || 'Donor'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Make a difference today - every drop counts</p>
        </div>
        {/* Campaigns Section */}
        <div className="mb-8 flex justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
              Campaigns
            </h2>
            <p className="text-gray-600 dark:text-gray-200">Discover and support our campaigns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const registered = campaign?.registered_donors?.includes(currentDonor.id) || false;
            const progressPercentage = getProgressPercentage(campaign.registration_count, campaign.target_donors);
            const statusConfig = getStatusConfig(campaign.status);
            const StatusIcon = statusConfig.icon;
            const isActionable = campaign.status === 'active' || campaign.status === 'upcoming';
            
            return (
              <div
                key={campaign.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${
                  registered ? 'ring-2 ring-green-500 dark:ring-green-600' : ''
                }`}
              >
                {/* Campaign Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={campaign.banner_image}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 left-4 ${statusConfig.bgColor} backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2`}>
                    <StatusIcon size={16} className={statusConfig.textColor} />
                    <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  
                  {registered && (
                    <div className="absolute top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                      <CheckCircle size={16} />
                      <span className="text-sm font-semibold">Registered</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {campaign.registration_count}/{campaign.target_donors} Donors
                    </span>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{campaign.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={18} className="text-red-500 dark:text-red-400" />
                      <span className="text-sm">
                        {new Date(campaign.start_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin size={18} className="text-red-500 dark:text-red-400" />
                      <span className="text-sm">{campaign.location.address_line1}, {campaign.location.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <RouteIcon size={18} className="text-blue-500 dark:text-blue-400" />
                      <span className="text-sm">Distance:</span>
                      {getDistanceToCampaign(campaign) && (
                        <span className="text-sm">
                          {getDistanceToCampaign(campaign)} km
                        </span>
                      )}
                    </div>
                  </div>

                  {isActionable && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Registration Progress</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {progressPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progressPercentage >= 90 
                              ? 'bg-linear-to-r from-orange-500 to-red-500' 
                              : 'bg-linear-to-r from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {campaign.status === 'cancelled' ? (
                    <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 py-3 rounded-lg font-semibold text-center">
                      Campaign Cancelled
                    </div>
                  ) : campaign.status === 'completed' ? (
                    <button
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      View Results
                      <ExternalLink size={18} />
                    </button>
                  ) : registered ? (
                    <button
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      View Details
                      <ExternalLink size={18} />
                    </button>
                  ) : (
                    <Link
                      to={`/dashboard/campaign/${campaign.id}/register`}
                      className="block w-full bg-linear-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all text-center shadow-lg"
                    >
                      {campaign.registration_count >= campaign.target_donors ? 'Campaign Full' : 'Register Now'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}