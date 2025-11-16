import React, { useCallback, useEffect, useState } from "react";
import {Calendar,MapPin, User,Droplet,Clock, AlertCircle,CheckCircle,XCircle,Phone,Mail,Navigation, RouteIcon } from "lucide-react";
import Modal from "./Modal";
import { requestService } from "../../services/requestService";
import { useAuth } from "../../hooks/useAuth";

export default function ViewRequestModal({ requestId, isOpen, onClose, onStatusChange  }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [request, setRequest] = useState([]);
  const [currentUserDistance, setCurrentUserDistance] = useState("N/A");
  const [requestApprovedDonorDistance, setRequestApprovedDonorDistance] = useState("N/A");
   
  
  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      await requestService.requestView(requestId);
      const requestData = await requestService.getRequestById(requestId);
      setRequest(requestData);
    } catch (error) {
      console.error("Error loading request:", error);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (isOpen){
      fetchRequest();
    }
  }, [isOpen, fetchRequest]);

  useEffect(() => {
    setStatus(request?.status);
  }, [request]);

  const handleAction = async (status) => {
    if (status === "approved") {
      await requestService.updateRequest(requestId, {
        status: "APPROVED",
      })
    } else if (status === "rejected") {
      await requestService.updateRequest(requestId, {
        status: "REJECTED",
      })
    } else if (status === "fulfilled") {
      await requestService.updateRequest(requestId, {
        status: "FULFILLED",
      })
    } else if (status === "cancelled") {
      await requestService.updateRequest(requestId, {
        status: "CANCELLED",
      })
    }
    if (onStatusChange) onStatusChange();
    await fetchRequest();
    onClose();
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return "N/A";
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    if (
      currentUser?.location?.latitude &&
      currentUser?.location?.longitude &&
      request?.location?.latitude &&
      request?.location?.longitude
    ) {
      const lat1 = parseFloat(currentUser.location.latitude);
      const lon1 = parseFloat(currentUser.location.longitude);
      const lat2 = parseFloat(request.location.latitude);
      const lon2 = parseFloat(request.location.longitude);

      if ([lat1, lon1, lat2, lon2].every(Number.isFinite)) {
        const d = calculateDistance(lat1, lon1, lat2, lon2);
        setCurrentUserDistance(d);
      } else {
        setCurrentUserDistance("N/A");
      }
    } else {
      setCurrentUserDistance("N/A");
    }

    if (request?.approved_by?.location?.latitude &&
      request?.approved_by?.location?.longitude &&
      request?.location?.latitude &&
      request?.location?.longitude) {
      const lat1 = parseFloat(request.approved_by.location.latitude);
      const lon1 = parseFloat(request.approved_by.location.longitude);
      const lat2 = parseFloat(request.location.latitude);
      const lon2 = parseFloat(request.location.longitude);

      if ([lat1, lon1, lat2, lon2].every(Number.isFinite)) {
        const d = calculateDistance(lat1, lon1, lat2, lon2);
        setRequestApprovedDonorDistance(d);
      } else {
        setRequestApprovedDonorDistance("N/A");
      }
    } else {
      setRequestApprovedDonorDistance("N/A");
      }
  }, [currentUser, request]);

  const getStatusColor = () => {
    switch (status) {
      case "APPROVED":
        return "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950";
      case "REJECTED":
        return "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950";
      case "CANCELLED":
        return "text-gray-700 bg-gray-200 dark:text-gray-400 dark:bg-gray-800";
      case "FULFILLED":
        return "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950";
      default:
        return "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950";
    }
  };

  const getUrgencyColor = () => {
    return request.urgency === "URGENT"
      ? "text-red-700 dark:text-red-400"
      : "text-orange-700 dark:text-orange-400";
  };
  if (!isOpen) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Details"
      modalSize="4xl"
      className="dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900"
    >
      {loading ? (
        <p className="text-center py-6 text-gray-700 dark:text-gray-300">
          Loading request details...
        </p>
      ) : !request ? (
        <p className="text-center py-6 text-gray-600 dark:text-gray-400">
          No request data found.
        </p>
      ) : (
        <div className="">
          <div className="max-w-4xl mx-auto">
            {/* Main Card */}
            <div className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl overflow-hidden border transition-colors duration-200">
              {/* Header */}
              <div className="bg-linear-to-r from-red-600 to-red-700 dark:from-red-900 dark:to-red-950 border-gray-200 dark:border-gray-800 p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      Blood Request Details
                    </h1>
                    <p className="text-red-100 dark:text-gray-300 text-sm font-mono">
                      ID: {request?.request_id}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}
                    >
                      {status}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getUrgencyColor()} bg-white dark:bg-gray-800`}
                    >
                      {request?.urgency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blood Info Section */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <div className="bg-red-100 dark:bg-red-950 p-3 rounded-full">
                      <Droplet className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Blood Group
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {request?.blood_group}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-full">
                      <Droplet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Units Required
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {request?.units_required}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <div className="bg-orange-100 dark:bg-orange-950 p-3 rounded-full">
                      <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Required By
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Nov 13, 4:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <div className="bg-purple-100 dark:bg-purple-950 p-3 rounded-full">
                      <Navigation className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Requester to Login User
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentUserDistance} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Patient Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Patient Name
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {request?.patient_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Age
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {request?.patient_age} years
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg md:col-span-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Reason
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {request?.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hospital & Location */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Hospital & Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Hospital
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {request?.hospital_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Address
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {request?.location?.address_line1}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {request?.location?.police_station},{" "}
                      {request?.location?.city}, {request?.location?.state}{" "}
                      {request?.location?.postal_code}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {request?.location?.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requester Information */}
            {request?.requested_by && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Requester Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
                            <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                        <p className="text-gray-900 dark:text-white font-semibold">
                            {request?.requested_by?.first_name}{" "}
                            {request?.requested_by?.last_name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            @{request?.requested_by?.username} •{" "}
                            {request?.requested_by?.role}
                        </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span>{request?.requested_by?.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="truncate">
                                {request?.requested_by?.email}
                            </span>
                        </div>
                    </div>
                    </div>
                </div>
            )}

              {/* Timestamps */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created At
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                        Nov 10, 2025 2:41 PM
                    </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-transparent p-4 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last Updated
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                        Nov 13, 2025 6:05 AM
                    </p>
                    </div>
                </div>
            </div>

              {/* Approval / Rejection / Cancellation / Fulfillment Info */}
              {(request?.approved_by ||
                request?.rejected_by ||
                request?.cancelled_by ||
                request?.fulfilled_by) && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <div className="bg-linear-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-2 rounded-lg shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    Request Review Details
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Approved Info */}
                    {request?.approved_by && (
                      <div className="relative overflow-hidden bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative flex items-start gap-4">
                          <div className="bg-green-600 dark:bg-green-700 p-3 rounded-xl shadow-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-green-800 dark:text-green-300 text-sm font-semibold mb-2 uppercase tracking-wide">
                              ✓ Approved By
                            </p>
                            <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                              {request?.approved_by?.first_name
                                ? `${request.approved_by.first_name} ${request.approved_by.last_name}`
                                : "System / Admin"}
                            </p>
                            <p className="text-green-700 dark:text-green-400 text-sm font-medium mb-2">
                              {request?.approved_by?.role || "ADMIN"}
                            </p>
                            {request?.approved_at && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(request.approved_at).toLocaleString()}
                              </p>
                            )}
                            {requestApprovedDonorDistance !== "N/A" && (
                              <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Distance Donor to Hospital</p>
                                <p className="text-green-700 dark:text-green-300 font-bold text-lg flex items-center gap-2">
                                  <RouteIcon className="w-4 h-4" />
                                  {requestApprovedDonorDistance} km
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejected Info */}
                    {request?.rejected_by && (
                      <div className="relative overflow-hidden bg-linear-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-red-200 dark:border-red-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 dark:bg-red-800 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative flex items-start gap-4">
                          <div className="bg-red-600 dark:bg-red-700 p-3 rounded-xl shadow-lg">
                            <XCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-red-800 dark:text-red-300 text-sm font-semibold mb-2 uppercase tracking-wide">
                              ✕ Rejected By
                            </p>
                            <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                              {request?.rejected_by?.first_name
                                ? `${request.rejected_by.first_name} ${request.rejected_by.last_name}`
                                : "System / Admin"}
                            </p>
                            <p className="text-red-700 dark:text-red-400 text-sm font-medium mb-2">
                              {request?.rejected_by?.role || "ADMIN"}
                            </p>
                            {request?.rejection_reason && (
                              <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <p className="text-xs text-red-700 dark:text-red-300 font-semibold mb-1">Rejection Reason:</p>
                                <p className="text-sm text-red-900 dark:text-red-200">
                                  {request.rejection_reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cancelled Info */}
                    {request?.cancelled_by && (
                      <div className="relative overflow-hidden bg-linear-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 border-2 border-gray-300 dark:border-gray-700 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative flex items-start gap-4">
                          <div className="bg-gray-600 dark:bg-gray-700 p-3 rounded-xl shadow-lg">
                            <AlertCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 dark:text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wide">
                              ⊘ Cancelled By
                            </p>
                            <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                              {request?.cancelled_by?.first_name
                                ? `${request.cancelled_by.first_name} ${request.cancelled_by.last_name}`
                                : "System / Admin"}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400 text-sm font-medium mb-2">
                              {request?.cancelled_by?.role || "USER"}
                            </p>
                            {request?.cancelled_at && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(request.cancelled_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fulfilled Info */}
                    {request?.fulfilled_by && (
                      <div className="relative overflow-hidden bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative flex items-start gap-4">
                          <div className="bg-blue-600 dark:bg-blue-700 p-3 rounded-xl shadow-lg">
                            <Droplet className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-blue-800 dark:text-blue-300 text-sm font-semibold mb-2 uppercase tracking-wide">
                              ✓ Fulfilled By
                            </p>
                            <p className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                              {request?.fulfilled_by?.first_name
                                ? `${request.fulfilled_by.first_name} ${request.fulfilled_by.last_name}`
                                : "Unknown Donor"}
                            </p>
                            <p className="text-blue-700 dark:text-blue-400 text-sm font-medium mb-2">
                              {request?.fulfilled_by?.role || "DONOR"}
                            </p>
                            {request?.fulfilled_at && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(request.fulfilled_at).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Action Buttons */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions</h2>
                    <div className="flex flex-wrap gap-3">

                    {currentUser?.role === "DONOR" && (
                      <>
                        {request?.status === "PENDING" ? (
                          <button
                            onClick={() => handleAction("approved")}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve Request
                          </button>
                        ) : request?.status === "APPROVED" ? (
                          <button
                              onClick={() => handleAction("cancelled")}
                              className="flex items-center gap-2 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                          >
                              <AlertCircle className="w-5 h-5" />
                              Cancel Request
                          </button>
                        ) : null}
                      </>
                    )}

                    {currentUser?.role === "ADMIN" && (
                      <>
                        <button
                        onClick={() => handleAction("rejected")}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                        <XCircle className="w-5 h-5" />
                        Reject Request
                        </button>
                      </>
                    )}

                    {(currentUser?.role === "ADMIN" ||
                      currentUser?.role === "RECEIVER" ||
                      currentUser?.role === "HOSPITAL") && (
                      <>
                        
                        <button
                            onClick={() => handleAction("cancelled")}
                            className="flex items-center gap-2 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Cancel Request
                        </button>
                        {request?.status === "APPROVED" && (
                          <button
                              onClick={() => handleAction("fulfilled")}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                          >
                              <CheckCircle className="w-5 h-5" />
                              Mark as Fulfilled
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
