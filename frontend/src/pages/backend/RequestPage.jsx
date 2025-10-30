import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { Eye } from "lucide-react";
import { requestService } from "../../services/requestService";
import RequestModal from "../../components/modals/RequestModal";



export default function RequestPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const res = await requestService.getAllRequests();
            setRequests(res.results || res || []);
          } catch (error) {
            console.error("Error loading donors:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchRequests();
      }, []);
    

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting donor ID:", id);
      // Add delete API call here later
    }
  };

  const handleView = (id) => {
    setSelectedRequestId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequestId(null);
  }

  return (
    <div className="p-6">
      <h1 className="dark:text-white text-2xl font-semibold text-center mb-6">
        Receiver List
      </h1>

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
                      ? `${request.location?.address_line1 || ""}, ${request.location?.city || ""}, ${request.location?.state || ""}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2">
                    <Button variant="primary" size="xs" onClick={() => {handleView(request.id)}}><Eye className="h-5 w-5" /> View</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(request.id)}>Delete</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <RequestModal isOpen={modalOpen} onClose={closeModal} requestId={selectedRequestId} />
    </div>
  );
}
