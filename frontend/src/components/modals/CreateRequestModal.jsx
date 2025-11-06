import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Loader2 } from "lucide-react";
import { requestService } from "../../services/requestService";
import { hospitalService } from "../../services/hospitalService";
import { useAuth } from "../../hooks/useAuth";

export default function CreateRequestModal({ isOpen, onClose, onSuccess, requestId }) {
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
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Bangladesh",
    },
  });

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser && isOpen) {
      const requesterType = currentUser.role === "HOSPITAL" ? "HOSPITAL" : "RECEIVER";
      
      setFormData({
        ...formData,
        requester_type: requesterType,
        requested_by: {
          username: currentUser.username || "",
          email: currentUser.email || "",
          first_name: currentUser.first_name || "",
          last_name: currentUser.last_name || "",
          phone_number: currentUser.phone_number || "",
        },
      });
    }
  }, [currentUser, isOpen]);

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

  // When hospital is selected
  const handleHospitalSelect = (hospitalId) => {
    const selectedHospital = hospitals.find((h) => h.id === parseInt(hospitalId));
    
    if (selectedHospital) {
      if (formData.requester_type === "HOSPITAL") {
        // For HOSPITAL type: set hospital ID, name, and location
        setFormData({
          ...formData,
          hospital: selectedHospital.id,
          hospital_name: selectedHospital.hospital_name,
          location: selectedHospital.location || formData.location,
        });
      } else if (formData.requester_type === "RECEIVER") {
        // For RECEIVER type: only set hospital name and location, NO hospital ID
        setFormData({
          ...formData,
          hospital_name: selectedHospital.hospital_name,
          location: selectedHospital.location || formData.location,
        });
      }
    } else {
      // Reset hospital-related fields
      setFormData({
        ...formData,
        hospital: "",
        hospital_name: "",
        location: {
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Bangladesh",
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, location: { ...formData.location, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare data - remove hospital field if requester type is RECEIVER
      const submitData = { ...formData };
      if (formData.requester_type === "RECEIVER") {
        delete submitData.hospital;
      }
      
      await requestService.createRequest(submitData);
      alert("Request created successfully!");

      if (onSuccess) {
       await onSuccess();
      }
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
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Bangladesh",
        },
      });
      
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalSize="3xl" title="Create Blood Request">
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-red-600 dark:text-red-400" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Requester Type - Display only, set from user role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requester Type</label>
            <input
              type="text"
              value={formData.requester_type}
              readOnly
              className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              disabled
            />
          </div>

          {/* Hospital Select - shown for both HOSPITAL and RECEIVER */}
          {formData.requester_type && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {formData.requester_type === "HOSPITAL" ? "Select Your Hospital" : "Select Hospital (Optional)"}
              </label>
              <select
                value={formData.hospital}
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
              value={formData.hospital_name}
              readOnly={!!formData.hospital}
              onChange={handleChange}
              name="hospital_name"
              className={`w-full mt-1 p-2 border rounded-md dark:border-gray-600 dark:text-gray-200 ${!!formData.hospital ? 'bg-gray-100 dark:bg-gray-700' : 'dark:bg-gray-800'}`}
            />
          </div>

          {/* Requester Info - Display only, populated from currentUser */}
          <div>
            <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Requester Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium dark:text-gray-300">USERNAME</label>
                <input
                  type="text"
                  value={formData.requested_by.username}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-gray-300">EMAIL</label>
                <input
                  type="text"
                  value={formData.requested_by.email}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-gray-300">FIRST NAME</label>
                <input
                  type="text"
                  value={formData.requested_by.first_name}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-gray-300">LAST NAME</label>
                <input
                  type="text"
                  value={formData.requested_by.last_name}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium dark:text-gray-300">PHONE NUMBER</label>
                <input
                  type="text"
                  value={formData.requested_by.phone_number}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Nested Location */}
          <div>
            <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {["address_line1","police_station","city","state","postal_code","country"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium dark:text-gray-300">{field.replace("_"," ").toUpperCase()}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData.location[field] || ""}
                    onChange={handleLocationChange}
                    className={`w-full mt-1 p-2 border rounded-md dark:border-gray-600 dark:text-gray-200 
                      ${!!formData.hospital ? 'bg-gray-100 dark:bg-gray-700' : 'dark:bg-gray-800'}`}
                    readOnly={!!formData.hospital}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Patient info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Name</label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Age</label>
              <input
                type="number"
                name="patient_age"
                value={formData.patient_age}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                required
              >
                <option value="">-- Select --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Units Required</label>
              <input
                type="number"
                name="units_required"
                value={formData.units_required}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
          </div>

          {/* Reason and Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                rows="2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                required
              >
                <option value="ROUTINE">Routine</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          {/* Required By Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Required By Date</label>
            <input
              type="datetime-local"
              name="required_by_date"
              value={formData.required_by_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:[color-scheme:dark]"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Create Request
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}