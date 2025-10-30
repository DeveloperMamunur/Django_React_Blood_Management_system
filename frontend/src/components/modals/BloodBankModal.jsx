import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { bloodBankService } from "../../services/bloodBankService";


export default function BloodBankModal({ bloodBankId, isOpen, onClose }) {
  const [bloodBank, setBloodBank] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bloodBankId || !isOpen) return;

    const fetchBloodBanks = async () => {
      setLoading(true);
      try {
        const res = await bloodBankService.getBloodBankById(bloodBankId);
        console.log(res);
        setBloodBank(res?.results ?? res ?? null);
      } catch (error) {
        console.error("Error fetching donor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodBanks();
  }, [bloodBankId, isOpen]);


  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Blood Bank Details"
      modalSize="4xl"
      className="dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900"
    >
      {loading ? (
        <p className="text-center py-6 text-gray-700 dark:text-gray-300">
          Loading Blood Bank details...
        </p>
      ) : !bloodBank ? (
        <p className="text-center py-6 text-gray-600 dark:text-gray-400">
          No blood Bank data found.
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
                  <td className="p-3 text-gray-800 dark:text-gray-200">blood Bank Name</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.name|| "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Registration Number</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.registration_number|| "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Username</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.managed_by?.username || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Email</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.managed_by?.email || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Blood Bank Email</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.email || "—"}
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Role</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.managed_by?.role || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Location</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    <span>{bloodBank.location?.address_line1}, </span>
                    {bloodBank.location && bloodBank.location.address_line2 && (
                      <span>{bloodBank.location.address_line2}, </span>
                    )}
                    <span>{bloodBank.location?.city}, </span> 
                    <span>{bloodBank.location?.state}, </span>
                    <span>{bloodBank.location?.country}, </span>
                    <span>{bloodBank.location?.postal_code}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Contact Person</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.contact_person || "No Contact provided"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Contact Number</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.contact_number || "No Contact provided"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Operating Hours</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.operating_hours || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Blood Bank Storage Capacity
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {bloodBank.storage_capacity}
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
