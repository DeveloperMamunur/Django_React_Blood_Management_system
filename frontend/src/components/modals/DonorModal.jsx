import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { donorService } from "../../services/donorService";


export default function DonorModal({ donorId, isOpen, onClose }) {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!donorId || !isOpen) return;

    const fetchDonors = async () => {
      setLoading(true);
      try {
        const res = await donorService.getDonorById(donorId);
        console.log(res);
        setDonor(res.results || res);
      } catch (error) {
        console.error("Error fetching donor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [donorId, isOpen]);


  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Donor Details"
      modalSize="4xl"
      className="dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900"
    >
      {loading ? (
        <p className="text-center py-6 text-gray-700 dark:text-gray-300">
          Loading donor details...
        </p>
      ) : !donor ? (
        <p className="text-center py-6 text-gray-600 dark:text-gray-400">
          No donor data found.
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
                  <td className="p-3 text-gray-800 dark:text-gray-200">Username</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.user?.username || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Email</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.user?.email || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Role</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.user?.role || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Location</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    <span>{donor.location?.address_line1}, </span>
                    <span>{donor.location?.police_station}, </span>
                    <span>{donor.location?.city}, </span> 
                    <span>{donor.location?.state}, </span>
                    <span>{donor.location?.country}, </span>
                    <span>{donor.location?.postal_code}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Bio</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.bio || "No bio provided"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">Blood Group</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.blood_group || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Date of Birth
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.date_of_birth || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Phone Number
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.phone_number || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Gender
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.gender === "M" ? "Male" : "Female"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      weight
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {donor.weight || "—"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      Last donation date
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {donor.last_donation_date || "—"}
                    </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    medical conditions
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.medical_conditions || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Available
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.is_available === true ? "Yes" : "No"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    willing to travel km
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.willing_to_travel_km || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Preferred donation time
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.preferred_donation_time || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Total Donations
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.total_donations || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Donation Points
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.donation_points || "—"}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/70">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    Verified
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">
                    {donor.is_verified && (
                      <div>
                        <span className="text-green-500 me-1">{donor.verified_at}</span>
                        <span className="text-green-500">By {donor.verified_by.username}</span> 
                      </div>
                    )}
                    {!donor.is_verified && (
                      <span className="text-red-500">No</span>
                    )}
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
