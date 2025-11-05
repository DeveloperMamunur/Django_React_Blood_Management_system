import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, ExternalLink, Clock, XCircle } from 'lucide-react';
import { campaignService } from '../../services/campaignService';
import { donorService } from '../../services/donorService';

export default function Dashboard() {
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
        console.log(res.results);
        
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
        const res = await donorService.currentDonor();
        const donorData = res.results || res;

        if (donorData) {
          setCurrentDonor(donorData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load campaigns. Please try again later.");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading campaigns...</p>
            </div>
          </div>
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
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Blood Donation Campaigns</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover and register for upcoming blood donation events in your area</p>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns
          .map((campaign) => {
            const registered = campaign?.registered_donors?.includes(currentDonor.id) || false;
            const progressPercentage = getProgressPercentage(campaign.registration_count, campaign.target_donors);
            const statusConfig = getStatusConfig(campaign.status);
            const StatusIcon = statusConfig.icon;
            const isActionable = campaign.status === 'active' || campaign.status === 'upcoming';
            
            return (
              <div
                key={campaign.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
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
                  {/* Campaign Status Badge */}
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

                  {/* Campaign Info */}
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
                  </div>

                  {/* Registration Progress */}
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
                              ? 'bg-orange-500 dark:bg-orange-600' 
                              : 'bg-red-500 dark:bg-red-600'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {campaign.status === 'cancelled' ? (
                    <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 py-3 rounded-lg font-semibold text-center">
                      Campaign Cancelled
                    </div>
                  ) : campaign.status === 'completed' ? (
                    <button
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => alert(`View details for campaign ${campaign.id}`)}
                    >
                      View Results
                      <ExternalLink size={18} />
                    </button>
                  ) : registered ? (
                    <button
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => alert(`View details for campaign ${campaign.id}`)}
                    >
                      View Details
                      <ExternalLink size={18} />
                    </button>
                  ) : (
                    <Link
                      to={`/dashboard/campaign/${campaign.id}/register`}
                      className="w-full bg-red-600 dark:bg-red-700 text-white py-3 px-3 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-500"
                      disabled={campaign.registration_count >= campaign.target_donors}
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