import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, Clock, UserPlus, Trash2, PenBoxIcon, User, RouteIcon} from 'lucide-react';
import { requestService } from '../../../services/requestService';
import { Button } from '../../../components/ui';
import ViewRequestModal from '../../../components/modals/ViewRequestModal';
import CreateRequestModal from '../../../components/modals/CreateRequestModal';
import EditRequestModal from '../../../components/modals/EditRequestModal';

export default function HospitalRequest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [modalType, setModalType] = useState(null);


  const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await requestService.getAllRequests();
        console.log(res.results);
        
        setRequests(res.results || res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (window.confirm(`Are you sure you want to change the status to "${status}"?`)) {
      await requestService.updateRequest(id, {
        status,
        approved_at: status === "APPROVED" ? new Date().toISOString() : null,
      });
      fetchRequests();
    }
  };

  const handleEdit = (id) => {
    setSelectedRequestId(id);
    setModalOpen(true);
    setModalType('edit');
  };

  const handleView = (id) => {
    setSelectedRequestId(id);
    setModalOpen(true);
    setModalType('view');
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequestId(null);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
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

  const getDistanceToDonor = (request) => {
    return calculateDistance(
      request.approved_by?.location.latitude,
      request.approved_by?.location.longitude,
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
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Blood Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track your blood donation requests
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedRequestId(null);
              setModalType('create');
              setModalOpen(true);
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg"
          >
            <UserPlus size={20} />
            Create Request
          </Button>
        </div>

        {/* Requests List */}
        {requests && requests.length > 0 ? (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group relative bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/5 dark:hover:shadow-red-500/10"
              >
                {/* Top colored bar with urgency indicator */}
                <div className={`h-2 ${
                  request.urgency === 'EMERGENCY' 
                    ? 'bg-linear-to-r from-red-600 via-red-500 to-red-600 dark:from-red-500 dark:via-red-400 dark:to-red-500' 
                    : request.urgency === 'URGENT'
                    ? 'bg-linear-to-r from-orange-600 via-orange-500 to-orange-600 dark:from-orange-500 dark:via-orange-400 dark:to-orange-500'
                    : 'bg-linear-to-r from-blue-600 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-blue-400 dark:to-blue-500'
                }`}></div>
                
                <div className="p-4 sm:p-6">
                  {/* Header Section - Patient Name and Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        <span className="text-gray-600 dark:text-gray-400">Patient Name: </span>
                        {request.patient_name}
                      </h3>
                      <p className="text-xs sm:text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 px-3 py-1 rounded-lg inline-block">
                        ID: {request.request_id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getStatusColor(request.status)} shadow-sm`}>
                        {request.status}
                      </span>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getUrgencyColor(request.urgency)} shadow-sm`}>
                        {request.urgency}
                      </span>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Blood Group Section */}
                    <div className="lg:col-span-3">
                      <div className="bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 rounded-xl p-4 border border-red-200 dark:border-red-800/50 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                            <span className="text-2xl sm:text-3xl font-bold text-white">
                              {request.blood_group}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Units Needed</p>
                            <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                              {request.units_required}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="lg:col-span-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Hospital */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Hospital</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {request.hospital_name || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center shrink-0">
                              <MapPin size={18} className="text-pink-600 dark:text-pink-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {request.location?.police_station}, {request.location?.city}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Required By Date */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
                              <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Required By</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatDate(request.required_by_date)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Patient Age */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                              <Clock size={18} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Patient Age</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {request.patient_age} years
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Reason for Request</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.reason}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="lg:col-span-3">
                      <div className="flex flex-row lg:flex-col gap-2 lg:h-full lg:justify-center">
                        <button
                          onClick={() => handleView(request.id)}
                          className="flex-1 lg:flex-none px-4 py-3 lg:py-3.5 bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 min-h-[44px]"
                        >
                          <ExternalLink size={18} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(request.id)}
                          className="flex-1 lg:flex-none px-4 py-3 lg:py-3.5 bg-linear-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 dark:hover:from-emerald-600 dark:hover:to-emerald-700 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20 min-h-[44px]"
                        >
                          <PenBoxIcon size={18} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this request?')) {
                              console.log('Delete request:', request.id);
                            }
                          }}
                          className="flex-1 lg:flex-none px-4 py-3 lg:py-3.5 bg-linear-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white rounded-xl hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 dark:shadow-red-500/20 min-h-[44px]"
                        >
                          <Trash2 size={18} />Delete
                        </button>
                        <select
                          onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          className="flex-1 lg:flex-none px-4 py-3 lg:py-3.5 bg-gray-50 dark:bg-gray-900/50 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700/50"
                        >
                          <option >Change Status</option>
                          <option value="PENDING">Re-request</option>
                          <option value="FULFILLED">Fulfilled</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700/50">
                  <div className="flex flex-col md:flex-row gap-4 justify-between px-5 py-3">
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                        <User size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Approved_by: {request.approved_by?.first_name ? request.approved_by.first_name+' '+request.approved_by.last_name : request.approved_by.username}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {request.approved_at ? new Date(request.approved_at).toLocaleString() : 'Not Approved'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-pink-600 dark:text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {request.approved_by?.location?.address_line1}, {request.approved_by?.location?.police_station}, {request.approved_by?.location?.postal_code}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {request.approved_by?.location?.city}, {request.approved_by?.location?.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center shrink-0">
                        <RouteIcon size={18} className="text-blue-500 dark:text-blue-400 mx-auto" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Distance
                        </p>
                        {getDistanceToDonor(request) && (
                          <div className="flex  gap-1 mt-1">
                            <span className="text-md text-blue-600 dark:text-blue-400 font-semibold">
                              {getDistanceToDonor(request)} km
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Requests Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't created any blood requests yet. Create your first request to get started.
            </p>
            <button
              onClick={() => {
                setSelectedRequestId(null);
                setModalType('create');
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
            >
              <UserPlus size={20} />
              Create Your First Request
            </button>
          </div>
        )}
      </div>

      {modalType === 'view' && (
        <ViewRequestModal
          isOpen={modalOpen}
          onClose={closeModal}
          requestId={selectedRequestId}
        />
      )}
      {modalType === 'edit' && (
        <EditRequestModal
          isOpen={modalOpen}
          onClose={closeModal}
          requestId={selectedRequestId}
          onSuccess={fetchRequests}
        />
      )}
      {modalType === 'create' && (
        <CreateRequestModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
}