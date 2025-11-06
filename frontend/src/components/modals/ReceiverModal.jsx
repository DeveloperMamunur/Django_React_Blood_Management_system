import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { receiverService } from "../../services/receiverService";


export default function ReceiverModal({ receiverId, isOpen, onClose }) {
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!receiverId || !isOpen) return;

    const fetchReceiver = async () => {
      try {
        setLoading(true);
        const res = await receiverService.getReceiverById(receiverId);
        setReceiver(res);
      } catch (error) {
        console.error("Error loading receiver:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver();
  }, [receiverId, isOpen]);



  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Receiver Details"
      modalSize="4xl"
      className="dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900"
    >
      {loading ? (
        <p className="text-center py-6 text-gray-700 dark:text-gray-300">
          Loading receiver details...
        </p>
      ) : !receiver ? (
        <p className="text-center py-6 text-gray-600 dark:text-gray-400">
          No receiver data found.
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
                  <td className="p-3 text-gray-800 dark:text-gray-200">Full Name</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.user?.full_name || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Username</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.user?.username || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Email</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.user?.email || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Role</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.user?.role || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Location</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    <span>{receiver.location?.address_line1}, </span>
                    <span>{receiver.location?.police_station}, </span>
                    <span>{receiver.location?.city}, </span> 
                    <span>{receiver.location?.state}, </span>
                    <span>{receiver.location?.country}, </span>
                    <span>{receiver.location?.postal_code}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Age</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.age || "No bio provided"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Blood Group</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.blood_group || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Contact Number
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.contact_number || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Emergency Contact
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.emergency_contact || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Notes
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {receiver.notes || "—"}
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
