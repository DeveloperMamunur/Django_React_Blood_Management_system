import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Loader2 } from "lucide-react";
import { requestService } from "../../services/requestService";
import { hospitalService } from "../../services/hospitalService";
import { useAuth } from "../../hooks/useAuth";

export default function EditRequestModal({ isOpen, onClose, onSuccess, requestId }) {
  const { currentUser } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    requester_type: "",
    requested_by: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
    },
    patient_name: "",
    patient_age: "",
    blood_group: "",
    units_required: "",
    reason: "",
    urgency: "ROUTINE",
    required_by_date: "",
    hospital: "",
    hospital_name: "",
    location: {
      address_line1: "",
      police_station: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Bangladesh",
    },
  });

  useEffect(() => {
    if (currentUser && isOpen && !requestId) {
      const requesterType = currentUser.role === "HOSPITAL" ? "HOSPITAL" : "RECEIVER";

      setFormData((prev) => ({
        ...prev,
        requester_type: requesterType,
        requested_by: {
          username: currentUser.username || "",
          email: currentUser.email || "",
          first_name: currentUser.first_name || "",
          last_name: currentUser.last_name || "",
          phone_number: currentUser.phone_number || "",
        },
        ...(requesterType === "HOSPITAL" && currentUser.hospital_profile
          ? {
              hospital: currentUser.hospital_profile.id,
              hospital_name: currentUser.hospital_profile.hospital_name,
              location: currentUser.hospital_profile.location || prev.location,
            }
          : {}),
      }));
    }
  }, [currentUser, isOpen, requestId]);

  // Fetch all hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await hospitalService.allHospitals();
        setHospitals(res.results || res);
      } catch (err) {
        console.error("Failed to fetch hospitals", err);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!requestId) return;
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const res = await requestService.getRequestById(requestId);
        const data = res.results || res;

        if (data.required_by_date) {
          data.required_by_date = new Date(data.required_by_date)
            .toISOString()
            .slice(0, 16);
        }

        setFormData(data);
      } catch (error) {
        console.error("Error loading request:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleHospitalSelect = (hospitalId) => {
    const selectedHospital = hospitals.find((h) => h.id === parseInt(hospitalId));
    
    if (selectedHospital) {
      setFormData((prev) => {
        if (prev.requester_type === "HOSPITAL") {
          return {
            ...prev,
            hospital: selectedHospital.id,
            hospital_name: selectedHospital.hospital_name,
            location: selectedHospital.location || prev.location,
          };
        } else if (prev.requester_type === "RECEIVER") {
          return {
            ...prev,
            hospital_name: selectedHospital.hospital_name,
            location: selectedHospital.location || prev.location,
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        hospital: "",
        hospital_name: "",
        location: {
          address_line1: "",
          police_station: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Bangladesh",
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (requestId) {
        await requestService.updateRequest(requestId, formData);
        alert("Request updated successfully!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const submitData = { ...formData };
        if (formData.requester_type === "RECEIVER") delete submitData.hospital;

        await requestService.createRequest(submitData);
        alert("Request created successfully!");
        if (onSuccess) onSuccess();

        // Reset form
        setFormData({
          requester_type: currentUser.role === "HOSPITAL" ? "HOSPITAL" : "RECEIVER",
          requested_by: {
            username: currentUser.username || "",
            email: currentUser.email || "",
            first_name: currentUser.first_name || "",
            last_name: currentUser.last_name || "",
            phone_number: currentUser.phone_number || "",
          },
          patient_name: "",
          patient_age: "",
          blood_group: "",
          units_required: "",
          reason: "",
          urgency: "ROUTINE",
          required_by_date: "",
          hospital: "",
          hospital_name: "",
          location: {
            address_line1: "",
            police_station: "",
            city: "",
            state: "",
            postal_code: "",
            country: "Bangladesh",
          },
        });

        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalSize="3xl" title={requestId ? "Edit Blood Request" : "Create Blood Request"}>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-red-600 dark:text-red-400" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requester Type</label>
            <input
              type="text"
              value={formData.requester_type}
              readOnly
              disabled
              className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Hospital Select */}
          {formData.requester_type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.requester_type === "HOSPITAL" ? "Select Your Hospital" : "Select Hospital (Optional)"}
              </label>
              <select
                value={formData.hospital || ""}
                onChange={(e) => handleHospitalSelect(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="">-- Select Hospital --</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hospital_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Hospital Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hospital Name</label>
            <input
              type="text"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              readOnly={!!formData.hospital}
              className={`w-full mt-1 p-2 border rounded-md dark:border-gray-600 dark:text-gray-200 ${
                formData.hospital ? "bg-gray-100 dark:bg-gray-700" : "dark:bg-gray-800"
              }`}
            />
          </div>

          {/* Requester Info */}
          <div>
            <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Requester Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ["username", formData.requested_by.username], 
                ["email", formData.requested_by.email], 
                ["first_name", formData.requested_by.first_name], 
                ["last_name", formData.requested_by.last_name],
                ["phone_number", formData.requested_by.phone_number]
              ].map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium dark:text-gray-300">{key.replace("_", " ").toUpperCase()}</label>
                  <input
                    type="text"
                    value={value || ""}
                    readOnly
                    className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["address_line1", "police_station", "city", "state", "postal_code", "country"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium dark:text-gray-300">{field.replace("_", " ").toUpperCase()}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData.location[field] || ""}
                    onChange={handleLocationChange}
                    readOnly={formData.hospital}
                    required
                    className={`w-full mt-1 p-2 border rounded-md dark:border-gray-600 dark:text-gray-200 ${
                      formData.hospital ? "bg-gray-100 dark:bg-gray-700" : "dark:bg-gray-800"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Name</label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Age</label>
              <input
                type="number"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="">-- Select --</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Units Required</label>
              <input
                type="number"
                name="units_required"
                value={formData.units_required}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Reason, Urgency, Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="2"
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="ROUTINE">Routine</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Required By Date</label>
            <input
              type="datetime-local"
              name="required_by_date"
              value={formData.required_by_date}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              required
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:scheme-dark"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {requestId ? "Update Request" : "Create Request"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
