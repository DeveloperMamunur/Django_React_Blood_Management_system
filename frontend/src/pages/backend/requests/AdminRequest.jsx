import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui";
import { Eye, Plus } from "lucide-react";
import { requestService } from "../../../services/requestService";
import ViewRequestModal from "../../../components/modals/ViewRequestModal";
import CreateRequestModal from "../../../components/modals/CreateRequestModal";
import { useAuth } from "../../../hooks/useAuth";


export default function AdminRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const { currentUser } = useAuth();

  const requestStatus = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
    { value: "APPROVED", label: "Approved", color: "bg-green-500 text-green-800 dark:bg-green-900 dark:text-green-300" },
    { value: "REJECTED", label: "Rejected", color: "bg-red-500 text-red-800 dark:bg-red-900 dark:text-red-300"},
    { value: "FULFILLED", label: "Fulfilled", color: "bg-blue-500 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-gray-500 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
  ];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await requestService.getAllRequests();
      setRequests(res.results || res || []);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting donor ID:", id);
      // Add delete API call here later
    }
  };

  const handleStatusChange = async (id, status) => {
    if (window.confirm(`Are you sure you want to change the status to "${status}"?`)) {
      await requestService.updateRequest(id, {
        status
      });
      fetchRequests();
    }
  };

  const handleView = (id) => {
    setSelectedRequestId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequestId(null);
  };

  const getStatusBadge = (status) => {
    const found = requestStatus.find((s) => s.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${found?.color || "bg-gray-100 text-gray-800"}`}>
        {found?.label || status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="dark:text-white text-3xl font-semibold text-center mb-6">
          Request List
        </h1>
        {currentUser?.role === "RECEIVER" || currentUser?.role === "HOSPITAL" || currentUser?.role === "ADMIN" && (
          <Button
            onClick={() => {
              setSelectedRequestId(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-5 w-5" /> Add Request
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading receivers...
          </p>
        ) : requests?.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No requests found.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Request Urgency</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Requester Type</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Requested By</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Blood Group</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Address</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Status</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{request?.urgency || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{request?.requester_type || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{request?.requested_by.username || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{request?.blood_group || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {request?.location
                      ? `${request.location?.address_line1 || ""}, ${request.location?.police_station || ""}, ${request.location?.city || ""}, ${request.location?.state || ""}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {getStatusBadge(request.status)} by 
                    <span className="text-gray-700 dark:text-gray-200 text-xs ms-1">
                      {request.status === "APPROVED"
                        ? request?.approved_by?.username || "—"
                        : request.status === "REJECTED"
                        ? request?.rejected_by?.username || "—"
                        : request.status === "FULFILLED"
                        ? request?.fulfilled_by?.username || "—"
                        : request.status === "CANCELLED"
                        ? request?.cancelled_by?.username || "—"
                        : "—"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2 items-center">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                      >
                        <option value="">Select Status</option>
                        {requestStatus
                          .map((status) => (
                            (<option key={status.value} value={status.value}>{status.label}</option>)
                          ))}
                        
                      </select>
                    <Button variant="primary" size="xs" onClick={() => handleView(request.id)}>
                      <Eye className="h-5 w-5" /> View
                    </Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(request.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateRequestModal
        isOpen={modalOpen && !selectedRequestId}
        onClose={closeModal}
        onSuccess={fetchRequests}
      />

      <ViewRequestModal
        isOpen={modalOpen && !!selectedRequestId}
        onClose={closeModal}
        requestId={selectedRequestId}
      />
    </div>
  );
}
