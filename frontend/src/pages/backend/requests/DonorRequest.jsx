import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, ExternalLink, Clock, XCircle, UserPlus, Droplet, AlertCircle, Phone, Navigation, Gauge, RouteIcon, Ruler} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { donorService } from '../../../services/donorService';
import { requestService } from '../../../services/requestService';

export default function DonorRequest() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [requests, setRequests] = useState([]);

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

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await requestService.getAllRequests();
      console.log(res.results);
      
      setRequests(res.results || res || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to approve this blood donation request?')) {
      try {
        await requestService.updateRequest(requestId, {
          status: 'APPROVED',
          approved_at: new Date().toISOString(),
          approved_by: currentDonor.id
        });
        alert('Request approved successfully! The hospital will contact you soon.');
        fetchRequests();
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
        });
        alert('Approval cancelled successfully.');
        fetchRequests();
      } catch (error) {
        console.error('Error cancelling approval:', error);
        alert('Failed to cancel approval. Please try again.');
      }
    }
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
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back, {currentDonor?.user?.first_name || 'Donor'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Make a difference today - every drop counts</p>
        </div>
          <div className="space-y-6">
            {requests
              .filter((request) => request.blood_group === currentDonor.blood_group)
              .length > 0 ? (
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
                  No Blood Requests Available for Approval
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