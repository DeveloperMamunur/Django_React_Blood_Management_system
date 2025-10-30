import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { requestService } from "../../services/requestService";

export default function RequestModal({ requestId, isOpen, onClose }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId || !isOpen) return;

    const fetchRequest = async () => {
      try {
        setLoading(true);
        const res = await requestService.getRequestById(requestId);
        setRequest(res);
      } catch (error) {
        console.error("Error loading request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, isOpen]);

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
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <th className="p-3 border-b border-gray-300 dark:border-gray-600 text-left font-semibold w-1/3">
                    Field
                  </th>
                  <th className="p-3 border-b border-gray-300 dark:border-gray-600 text-left font-semibold">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Request ID</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.request_id || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Requester Type</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.requester_type || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Urgency Level</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.urgency || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Required By Date</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.required_by_date || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Requested By</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.requested_by?.username ||  "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Blood Group</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.blood_group || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Units Required</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {request?.units_required || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Address</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request?.location
                      ? `${request.location.address_line1 || ""}, ${
                          request.location.city || ""
                        }, ${request.location.state || ""}, ${
                          request.location.country || ""
                        }, ${request.location.postal_code || ""}`
                      : "—"}
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Hospital Name</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request.hosptal?.hosptal_name || request.hospital_name || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Patient Name</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request.patient_name || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Patient Age</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request.patient_age || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Reason</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request.reason || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Created At</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {new Date(request?.created_at).toLocaleString() || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Status</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request?.status || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Approved</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {request?.approved_at ? (
                    <span>
                        <span className="text-red-500">
                            {request?.approved_at} By {request?.approved_by?.username}
                        </span>
                    </span>
                    ) : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
