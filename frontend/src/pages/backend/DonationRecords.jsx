import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, XCircle, CircleSlash } from "lucide-react";
import { donorService } from "../../services/donorService";
import DonationRecordModal from "../../components/modals/DonationRecordModal";


export default function DonationRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await donorService.getDonorRecords();
      console.log(data.results);
      setRecords(data.results || data || []);
    } catch (e) {
      console.error("Error loading donation records:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openCreate = () => {
    setSelectedRecord(null);
    setOpenModal(true);
  };

  const openEdit = (item) => {
    setSelectedRecord(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await donorService.deleteDonorRecord(id);
      fetchRecords();
    } catch (e) {
      console.error("Error deleting:", e);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    fetchRecords();
  };

  const statusColors = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300">Donation Records</h2>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          <PlusCircle size={18} /> Add Record
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No donation records found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Donor</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Units</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="border-t">
                  <td className="p-3">{rec?.donor?.full_name || "—"}</td>
                  <td className="p-3">{rec.blood_group}</td>
                  <td className="p-3">{rec.units_donated}</td>
                  <td className="p-3">
                    {new Date(rec.donation_date).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`${statusColors[rec.status]} px-3 py-1 rounded-full text-sm`}
                    >
                      {rec.status}
                    </span>
                  </td>

                  <td className="p-3 flex justify-end gap-2">
                    <button
                      className="p-2 hover:bg-gray-200 rounded"
                      onClick={() => openEdit(rec)}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="p-2 hover:bg-red-200 text-red-600 rounded"
                      onClick={() => handleDelete(rec.id)}
                    >
                      <XCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <DonationRecordModal
          record={selectedRecord}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
