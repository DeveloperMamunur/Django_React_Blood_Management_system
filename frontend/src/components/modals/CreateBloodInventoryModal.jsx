import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { bloodBankService } from "../../services/bloodBankService";

const BLOOD_GROUPS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

export default function CreateBloodInventoryModal({
  isOpen,
  onClose,
  bloodInventoryId,
  bloodBankId,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    blood_group: "",
    units_available: "",
    units_reserved: "",
    minimum_threshold: "",
    critical_threshold: "",
  });
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(bloodInventoryId);

  // Load existing data for edit
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      (async () => {
        setLoading(true);
        try {
          const res = await bloodBankService.getBloodInventoryById(
            bloodBankId,
            bloodInventoryId
          );
          setFormData({
            blood_group: res?.blood_group || "",
            units_available: res?.units_available || 0,
            units_reserved: res?.units_reserved || 0,
            minimum_threshold: res?.minimum_threshold || 10,
            critical_threshold: res?.critical_threshold || 5,
          });
        } catch (err) {
          console.error("Error loading inventory:", err);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      // reset form when creating new
      setFormData({
        blood_group: "",
        units_available: "",
        units_reserved: "",
        minimum_threshold: 10,
        critical_threshold: 5,
      });
    }
  }, [isOpen, isEdit, bloodInventoryId, bloodBankId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await bloodBankService.updateBloodInventory(
          bloodBankId,
          bloodInventoryId,
          formData
        );
      } else {
        await bloodBankService.createBloodInventory(bloodBankId, formData);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.log(err.response?.data);
      console.error("Error saving inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Blood Inventory" : "Add Blood Inventory"}
      modalSize="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium mb-1">Blood Group</label>
          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          >
            <option value="">Select...</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Units Available */}
        <div>
          <label className="block text-sm font-medium mb-1">Units Available</label>
          <input
            type="number"
            name="units_available"
            value={formData.units_available}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Units Reserved */}
        <div>
          <label className="block text-sm font-medium mb-1">Units Reserved</label>
          <input
            type="number"
            name="units_reserved"
            value={formData.units_reserved}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Minimum Threshold */}
        <div>
          <label className="block text-sm font-medium mb-1">Minimum Threshold</label>
          <input
            type="number"
            name="minimum_threshold"
            value={formData.minimum_threshold}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Critical Threshold */}
        <div>
          <label className="block text-sm font-medium mb-1">Critical Threshold</label>
          <input
            type="number"
            name="critical_threshold"
            value={formData.critical_threshold}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
