import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { hospitalService } from "../../services/hospitalService";

export default function HospitalModal({ hospitalId, isOpen, onClose }) {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hospitalId || !isOpen) return;

    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const res = await hospitalService.getHospitalById(hospitalId);
        console.log(res);
        setHospital(res.results || res);
      } catch (error) {
        console.error("Error fetching donor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [hospitalId, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hospital Details"
      modalSize="4xl"
      className="dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900"
    >
      {loading ? (
        <p className="text-center py-6 text-gray-700 dark:text-gray-300">
          Loading Hospital details...
        </p>
      ) : !hospital ? (
        <p className="text-center py-6 text-gray-600 dark:text-gray-400">
          No hospital data found.
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
                  <td className="p-3 text-gray-800 dark:text-gray-200">Hospital Name</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.hospital_name|| "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Registration Number</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.registration_number|| "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Hospital Type</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.hospital_type|| "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Username</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.user?.username || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Email</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.user?.email || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Role</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.user?.role || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Location</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    <span>{hospital.location?.address_line1}, </span>
                    <span>{hospital.location?.police_station}, </span>
                    <span>{hospital.location?.city}, </span> 
                    <span>{hospital.location?.state}, </span>
                    <span>{hospital.location?.country}, </span>
                    <span>{hospital.location?.postal_code}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Emergency Contact</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.emergency_contact || "No Contact provided"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Website</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.website || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Hospital Blood Bank
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.has_blood_bank === true ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Bed Capacity
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.bed_capacity || "—"}
                  </td>
                </tr>
               
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Verified
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.is_verified === true ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    License Document
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {hospital.license_document}
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
