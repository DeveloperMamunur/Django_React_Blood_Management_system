import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, ExternalLink, Clock, XCircle, UserPlus, Droplet, AlertCircle, Phone, Navigation, Gauge, RouteIcon, Ruler, HeartPulse, Heart, Pointer, PercentCircle} from 'lucide-react';
import { campaignService } from '../../../services/campaignService';
import { useAuth } from '../../../hooks/useAuth';
import { donorService } from '../../../services/donorService';
import { requestService } from '../../../services/requestService';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await campaignService.allCampaigns();
        setAllCampaigns(res.results || res || []);
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
    const filteredCampaigns = allCampaigns.filter(campaign => campaign.status === 'ACTIVE');
    setCampaigns(filteredCampaigns.slice(0, 3));
  }, [allCampaigns]);

  useEffect(() => {
    if (currentUser.role === 'DONOR') {
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
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await requestService.getAllRequests();
        const allReq = res.results || res || [];
        console.log("fetch all request", allReq);
        
        setAllRequests(allReq);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    setRequests(allRequests.slice(0, 3));
  }, [allRequests]);

  const handleApproveRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to approve this blood donation request?')) {
      try {
        await requestService.updateRequest(requestId, {
          status: 'APPROVED',
          approved_at: new Date().toISOString(),
          approved_by: currentDonor.id
        });
        alert('Request approved successfully! The hospital will contact you soon.');
      } catch (error) {
        console.error('Error approving request:', error);
        alert('Failed to approve request. Please try again.');
      }
    }
  };

  const handleCancelApproval = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel your approval for this request?')) {
      try {
        await requestService.updateRequest(requestId, {
          status: 'PENDING',
          approved_at: null,
          approved_by: currentDonor.id
        });
        alert('Approval cancelled successfully.');
      } catch (error) {
        console.error('Error cancelling approval:', error);
        alert('Failed to cancel approval. Please try again.');
      }
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'FULFILLED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'URGENT':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getDistanceToHospital = (request) => {
    if (!currentDonor?.location?.latitude || !currentDonor?.location?.longitude || 
        !request.location?.latitude || !request.location?.longitude) {
      return null;
    }
    return calculateDistance(
      currentDonor.location.latitude,
      currentDonor.location.longitude,
      request.location.latitude,
      request.location.longitude
    );
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white my-4">Campaigns</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          <div className="bg-amber-700 dark:bg-amber-600 text-white hover:bg-amber-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">Total Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allCampaigns?.length || 0}
              </p>
            </div>
          </div>
          <div className="bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <h3 className="text-lg font-semibold">Upcoming Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allCampaigns.filter((campaign) => campaign.status === 'PENDING').length}
              </p>
            </div>
          </div>
          <div className="bg-purple-500 dark:bg-purple-600 text-white hover:bg-purple-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Heart size={24} />
              <h3 className="text-lg font-semibold">Total Registration Campaign</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allCampaigns.filter((campaign) => campaign.registered_donors.includes(currentDonor.id)).length}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white my-4">Request</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          <div className="bg-yellow-400 dark:bg-yellow-500 text-white hover:bg-yellow-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Ruler size={24} />
              <h3 className="text-lg font-semibold">Total Requests</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allRequests?.filter((request) => request.status === 'PENDING').length}
              </p>
            </div>
          </div>
          <div className="bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">{currentDonor?.blood_group || 'Blood Group'} Blood Request</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allRequests?.filter((request) => request.blood_group === currentDonor?.blood_group).length}
              </p>
            </div>
          </div>
          <div className="bg-pink-500 dark:bg-pink-600 text-white hover:bg-pink-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Heart size={24} />
              <h3 className="text-lg font-semibold">Request Complete</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allRequests?.filter((request) => request.status === 'FULFILLED').length}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white my-4">Donation Statistics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 my-6">
          <div className="bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Heart size={24} />
              <h3 className="text-lg font-semibold">Total Donations</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {allRequests?.filter((donation) => donation.status === 'FULFILLED').length}
              </p>
            </div>
          </div>
          <div className="bg-violet-500 dark:bg-violet-600 text-white hover:bg-violet-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <PercentCircle size={24} />
              <h3 className="text-lg font-semibold">Donation Point</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentDonor?.health_score || 0}
              </p>
            </div>
          </div>
          <div className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Heart className="text-red-500 dark:text-red-400" size={24} />
              <h3 className="text-lg font-semibold text-white dark:text-gray-200">Blood Type</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentDonor?.blood_group || 'Blood Group'}
              </p>
            </div>
          </div>
          <div className="bg-rose-400 dark:bg-rose-500 text-white hover:bg-rose-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Gauge className="text-red-200 dark:text-red-400" size={24} />
              <h3 className="text-lg font-semibold text-white dark:text-gray-200">Health Score</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentDonor?.health_score || 0}
              </p>
            </div>
          </div>
          <div className="bg-fuchsia-600 dark:bg-fuchsia-700 text-white hover:bg-fuchsia-700 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <HeartPulse className="text-red-500 dark:text-red-400" size={24} />
              <h3 className="text-lg font-semibold text-white dark:text-gray-200">Blood Pressure</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentDonor?.blood_pressure || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              {currentDonor?.is_available ? (
                <>
                <CheckCircle size={24} />
                <h3 className="text-lg font-semibold text-white dark:text-gray-200">Available</h3>
                </>
              ) : (
                <>
                <XCircle size={24} />
                <h3 className="text-lg font-semibold text-white dark:text-gray-200">Not Available</h3>
                </>
              )}
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                For Donation
              </p>
            </div>
          </div>
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
                      <span className="text-sm">{campaign.location.address_line1}, {campaign.location.city}, {campaign.location.country}</span>
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
          <div className="md:col-span-2 xl:col-span-3 mx-auto">
            <Link
              to="/dashboard/campaigns"
              className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition-colors"
            >
              View All Campaigns
            </Link>
          </div>
        </div>

        {/* Blood Requests Section */}
        <div className="bg-white dark:bg-gray-800 text-center rounded-lg px-4 py-6 gap-6 shadow-lg max-w-7xl mx-auto my-10">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Blood Requests for You</h3>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage your blood requests for various blood types.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {requests.length > 0 ? (
            requests
              .filter((request) => request.blood_group === currentDonor.blood_group)
              .map((request) => (
              <div
                key={request.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600"
              >
                {/* Urgency indicator bar */}
                <div className={`h-2 ${
                  request.urgency === 'EMERGENCY' 
                    ? 'bg-linear-to-r from-red-600 via-red-500 to-red-600 animate-pulse' 
                    : request.urgency === 'URGENT'
                    ? 'bg-linear-to-r from-orange-600 via-orange-500 to-orange-600'
                    : 'bg-linear-to-r from-blue-600 via-blue-500 to-blue-600'
                }`}></div>
                
                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Blood Group Circle */}
                        <div className="w-20 h-20 bg-linear-to-br from-red-600 to-pink-600 dark:from-red-500 dark:to-pink-500 rounded-full flex items-center justify-center shadow-xl shrink-0 ring-4 ring-red-100 dark:ring-red-900/50">
                          <span className="text-2xl font-bold text-white">
                            {request.blood_group}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            {request.patient_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            ID: {request.request_id.slice(0, 8)}...
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(request.status)} shadow-sm`}>
                              {request.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getUrgencyColor(request.urgency)} shadow-sm flex items-center gap-1`}>
                              {request.urgency === 'EMERGENCY' && <AlertCircle size={14} />}
                              {request.urgency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Units Required - Prominent Display */}
                    <div className="bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-purple-950/40 rounded-2xl p-4 text-center border-2 border-red-200 dark:border-purple-800 shadow-lg">
                      <div className="text-sm text-center text-gray-600 dark:text-gray-400 mb-1">
                        <p className="font-bold text-red-600 dark:text-red-400 mb-2">Distance</p>
                        <RouteIcon size={18} className="text-blue-500 dark:text-blue-400 mx-auto" />
                      </div>
                      {getDistanceToHospital(request) && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-md text-blue-600 dark:text-blue-400 font-semibold mx-auto">
                            {getDistanceToHospital(request)} km
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 rounded-2xl p-4 text-center border-2 border-red-200 dark:border-red-800 shadow-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Units Needed</p>
                      <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                        {request.units_required}
                      </p>
                      <Droplet className="mx-auto mt-2 text-red-500 dark:text-red-400" size={24} />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Hospital */}
                    <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <MapPin size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Hospital</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {request.hospital_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                          <MapPin size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Location</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {request.location?.police_station}, {request.location?.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Required By */}
                    <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Clock size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Required By</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(request.required_by_date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Patient Age */}
                    <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 rounded-xl p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center shadow-lg">
                          <UserPlus size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Patient Age</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {request.patient_age} years
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-500 dark:text-red-400 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">Reason for Request</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                          {request.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {request.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex-1 px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <CheckCircle size={24} />
                          Approve & Donate
                        </button>
                        <button
                          className="flex-1 sm:flex-none px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Phone size={20} />
                          Contact Hospital
                        </button>
                      </>
                    ) : request.status === 'APPROVED' && request.approved_by.id === currentUser.id ? (
                      <>
                        <div className="flex-1 px-6 py-4 bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                          <CheckCircle size={20} />
                          You Approved This Request
                        </div>
                        <button
                          onClick={() => handleCancelApproval(request.id)}
                          className="flex-1 sm:flex-none px-6 py-4 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <XCircle size={20} />
                          Cancel Approval
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        {request.status === 'APPROVED' ? 'Approved by Another Donor' : request.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-linear-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Droplet size={48} className="text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Blood Requests Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                There are currently no pending blood donation requests. Check back later or explore active campaigns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}