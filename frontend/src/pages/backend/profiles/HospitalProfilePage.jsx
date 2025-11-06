import React, { useEffect, useState } from "react";
import {
  Loader2,
  Edit3,
  PlusCircle,
  MapPin,
  User,
  Phone,
  Building2,
  Globe,
  Bed,
  Shield
} from "lucide-react";
import { hospitalService } from "../../../services/hospitalService";

export default function HospitalProfilePage() {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: {},
  });

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        const res = await hospitalService.currentHospital();
        const hospitalData = res.results || res;

        if (hospitalData && hospitalData.id) {
          setHospital(hospitalData);
          setFormData({
            ...hospitalData,
            location: hospitalData.location || {},
            user: hospitalData.user || {},
          });
          setCreating(false);
        } else {
          setCreating(true);
        }
      } catch (error) {
        console.error("Error fetching hospital details:", error);
        // If 404 or no hospital found, set creating mode
        if (error.response?.status === 404) {
          setCreating(true);
        } else {
          setCreating(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (creating || !hospital?.id) {
        const response = await hospitalService.createHospital(formData);
        setHospital(response);
        setCreating(false);
        alert("Hospital profile created successfully!");
      } else {
        const response = await hospitalService.updateHospital(hospital.id, formData);
        setHospital(response);
        alert("Hospital profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving hospital profile:", error);
      alert("Error saving hospital profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600 dark:text-red-400" />
        <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
          Loading profile...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 dark:bg-red-500 p-3 rounded-xl shadow-md">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {creating ? "Create Hospital Profile" : "Hospital Profile"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {creating
                  ? "Set up your hospital profile"
                  : "Manage your hospital information"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Personal Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </div>
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { field: "first_name", label: "First Name" },
                  { field: "last_name", label: "Last Name" },
                  { field: "username", label: "Username" },
                  { field: "phone_number", label: "Phone Number" },
                  { field: "email", label: "Email" },
                ].map(({ field, label, col }) => (
                  <div key={field} className={col}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={formData.user[field] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          user: {
                            ...formData.user,
                            [field]: e.target.value,
                          },
                        })
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hospital Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Hospital Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Hospital Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hospital_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, hospital_name: e.target.value })
                  }
                  placeholder="Enter hospital name"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.registration_number || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registration_number: e.target.value,
                    })
                  }
                  placeholder="Enter registration number"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Hospital Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hospital Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.hospital_type || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, hospital_type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select Hospital Type</option>
                  <option value="GOVERNMENT">Government</option>
                  <option value="PRIVATE">Private</option>
                  <option value="CHARITABLE">Charitable</option>
                </select>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Bed Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bed Capacity
                </label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="number"
                    value={formData.bed_capacity || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, bed_capacity: e.target.value })
                    }
                    placeholder="Enter bed capacity"
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Has Blood Bank */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.has_blood_bank || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        has_blood_bank: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-red-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hospital has a blood bank
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emergency Contact <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="tel"
                    value={formData.emergency_contact || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergency_contact: e.target.value,
                      })
                    }
                    placeholder="Enter emergency contact"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* License Document Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                License Document
              </h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload License
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, license_document: file });
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100 dark:file:bg-gray-600 dark:file:text-gray-200 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Upload hospital license document (PDF, JPG, PNG)
              </p>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Location
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  field: "address_line1",
                  label: "Address Line 1",
                  col: "md:col-span-2",
                },
                {
                  field: "police_station",
                  label: "Police Station",
                  col: "md:col-span-2",
                },
                { field: "city", label: "City" },
                { field: "state", label: "State" },
                { field: "postal_code", label: "Postal Code" },
                { field: "country", label: "Country" },
              ].map(({ field, label, col }) => (
                <div key={field} className={col}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={formData.location[field] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          [field]: e.target.value,
                        },
                      })
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{creating ? "Creating..." : "Updating..."}</span>
                </>
              ) : creating ? (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Profile</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}