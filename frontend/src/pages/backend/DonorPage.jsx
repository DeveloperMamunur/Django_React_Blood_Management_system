import { useEffect, useState } from "react";
import { donorService } from "../../services/donorService";
import { Button } from "../../components/ui";
import { Eye } from "lucide-react";
import DonorModal from "../../components/modals/DonorModal";

export default function DonorPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await donorService.getAllDonors();
        setDonors(res.results || res || []);
      } catch (error) {
        console.error("Error loading donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting donor ID:", id);
      // Add delete API call here later
    }
  };

  const handleView = (id) => {
    setSelectedDonorId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDonorId(null);
  }

  return (
    <div className="p-6">
      <h1 className="dark:text-white text-2xl font-semibold text-center mb-6">
        Donor List
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading donors...
          </p>
        ) : donors?.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No donors found.
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
              {donors.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{donor?.user.username || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{donor?.user.email || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{donor?.user.phone_number || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {donor?.location
                      ? `${donor.location?.address_line1 || ""}, ${donor.location?.city || ""}, ${donor.location?.state || ""}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{donor?.blood_group || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2">
                    <Button variant="primary" size="xs" onClick={() => {handleView(donor.id)}}><Eye className="h-5 w-5" /> View</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(donor.id)}>Delete</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DonorModal isOpen={modalOpen} onClose={closeModal} donorId={selectedDonorId} />
    </div>
  );
}
