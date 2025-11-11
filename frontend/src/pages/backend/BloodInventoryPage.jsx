import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui";
import { ArrowLeft, PenBox, Plus, Trash2 } from "lucide-react";
import { bloodBankService } from "../../services/bloodBankService";
import CreateBloodInventoryModal from "../../components/modals/CreateBloodInventoryModal";
import { useAuth } from "../../hooks/useAuth";

export default function BloodInventoryPage() {
    const { bloodBankId } = useParams(); 
    const [bloodBank, setBloodBank] = useState(null);
    const [bloods, setBloods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBloodId, setSelectedBloodId] = useState(null);
    const { currentUser } = useAuth();


    const fetchBloods = async () => {
      try {
        const [inventoryRes, bankRes] = await Promise.all([
            bloodBankService.getAllBloodsInventory(bloodBankId),
            bloodBankService.getBloodBankById(bloodBankId)
        ]);

      setBloods(inventoryRes?.results || inventoryRes || []);
      setBloodBank(bankRes);
      } catch (error) {
        console.error("Error loading donors:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchBloods();
  }, []);


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      console.log("Deleting Hospital ID:", id);
      // Add delete API call here later
    }
  };

  const handleModalOpen = (id) => {
    setSelectedBloodId(id);
    setModalOpen(true);
  };


  const handleView = (id) => {
    setSelectedBloodId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBloodId(null);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="dark:text-white text-2xl font-semibold text-center mb-6">
          {bloodBank?.name || "Blood Bank"} Inventory
        </h1>
        <div className="flex gap-2">
          {currentUser?.role === 'ADMIN' &&(
            <Link to="/dashboard/blood-banks" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-lg flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300"><ArrowLeft className="w-6 h-6" />Back</Link>
          )}
          <Button variant="primary" size="xs" onClick={() => handleModalOpen(null)}>
            <Plus className="w-6 h-6" />Add Inventory
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading donors...
          </p>
        ) : bloods?.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No donors found.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">blood group</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Units Available</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Units Reserved</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Last Updated</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bloods.map((blood) => (
                <tr key={blood.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{blood?.blood_group|| "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{blood?.units_available|| "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{blood?.units_reserved || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{blood?.last_updated || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200 flex gap-2">
                    <Button variant="primary" size="xs" onClick={() => handleView(blood.id)}><PenBox className="h-5 w-5" />Edit</Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(blood.id)}><Trash2 className="h-5 w-5" />Delete</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateBloodInventoryModal
        isOpen={modalOpen}
        onClose={closeModal}
        bloodInventoryId={selectedBloodId}
        bloodBankId={bloodBankId}
        onSuccess={fetchBloods}
      />
    </div>
  );
}
