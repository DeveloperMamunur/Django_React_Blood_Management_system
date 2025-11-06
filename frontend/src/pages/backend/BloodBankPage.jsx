import { useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { Eye, Pencil, Trash2, Package} from "lucide-react";
import { bloodBankService } from "../../services/bloodBankService";
import BloodBankModal from "../../components/modals/BloodBankModal";
import { Link } from "react-router-dom";

export default function BloodBankPage() {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBloodBankId, setSelectedBloodBankId] = useState(null);

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const res = await bloodBankService.getAllBloodBanks();
        setBloodBanks(res.results || res || []);
      } catch (error) {
        console.error("Error loading Hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodBanks();
  }, []);


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting Hospital ID:", id);
      // Add delete API call here later
    }
  };

  const handleView = (id) => {
    setSelectedBloodBankId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBloodBankId(null);
  }


  return (
    <div className="p-6">
      <h1 className="dark:text-white text-2xl font-semibold text-center mb-6">
        Blood Bank List
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading donors...
          </p>
        ) : bloodBanks?.length === 0 ? (
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
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bloodBanks.map((bloodBank) => (
                <tr key={bloodBank.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{bloodBank?.managed_by.username || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{bloodBank?.managed_by.email || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{bloodBank?.managed_by.phone_number || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {bloodBank?.location
                      ? `${bloodBank.location?.address_line1 || ""}, ${bloodBank.location?.police_station || ""},${bloodBank.location?.city || ""}, ${bloodBank.location?.state || ""}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2">
                    <Button variant="primary" size="xs" onClick={() => {handleView(bloodBank.id)}}><Eye className="h-5 w-5" /> View</Button>
                    <Link to={`/dashboard/blood-banks/${bloodBank.id}/inventory`} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded text-nowrap"><Package className="h-5 w-5" /> Inventory</Link>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(bloodBank.id)}>Delete</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <BloodBankModal isOpen={modalOpen} onClose={closeModal} bloodBankId={selectedBloodBankId} />
    </div>
  );
}
