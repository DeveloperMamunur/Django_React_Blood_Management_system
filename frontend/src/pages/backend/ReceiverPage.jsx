import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { Eye } from "lucide-react";
import { receiverService } from "../../services/receiverService";
import ReceiverModal from "../../components/modals/ReceiverModal";


export default function ReceiverPage() {
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);

  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        const res = await receiverService.getAllReceivers();
        setReceivers(res.results || res || []);
      } catch (error) {
        console.error("Error loading donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivers();
  }, []);



  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting donor ID:", id);
      // Add delete API call here later
    }
  };

  const handleView = (id) => {
    setSelectedReceiverId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReceiverId(null);
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
        ) : receivers?.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No receivers found.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Username</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Email</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Phone</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Address</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Blood Group</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {receivers.map((receiver) => (
                <tr key={receiver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{receiver?.user.username || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{receiver?.user.email || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{receiver?.user.phone_number || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {receiver?.location
                      ? `${receiver.location?.address_line1 || ""}, ${receiver.location?.city || ""}, ${receiver.location?.state || ""}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{receiver?.blood_group || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2">
                    <Button variant="primary" size="xs" onClick={() => {handleView(receiver.id)}}><Eye className="h-5 w-5" /> View</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(receiver.id)}>Delete</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ReceiverModal isOpen={modalOpen} onClose={closeModal} receiverId={selectedReceiverId} />
    </div>
  );
}
