import React, { useState } from "react";
import { X } from "lucide-react";
import { donorService } from "../../services/donorService";

export default function DonationRecordModal({ record, onClose }) {
  const isEdit = Boolean(record);

  const [form, setForm] = useState({
    donor: record?.donor?.id || "",
    blood_bank: record?.blood_bank || "",
    donation_date: record?.donation_date || "",
    blood_group: record?.blood_group || "",
    units_donated: record?.units_donated || 1.0,
    status: record?.status || "SCHEDULED",
    notes: record?.notes || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await donorService.updateDonorRecord(record.id, form);
      } else {
        await donorService.createDonorRecord(form);
      }
      onClose();
    } catch (e) {
      console.error("Error saving donation record:", e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Donation Record" : "Create Donation Record"}
          </h3>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-semibold">Donor ID</label>
            <input
              type="text"
              name="donor"
              value={form.donor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Blood Bank</label>
            <input
              type="text"
              name="blood_bank"
              value={form.blood_bank}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Blood Group</label>
            <input
              type="text"
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Units Donated</label>
            <input
              type="number"
              name="units_donated"
              value={form.units_donated}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-semibold">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
        >
          {isEdit ? "Update Record" : "Create Record"}
        </button>
      </div>
    </div>
  );
}
