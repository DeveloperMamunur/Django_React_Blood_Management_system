import React, { useEffect, useState } from "react";
import {
  Loader2,
  Edit3,
  PlusCircle,
  MapPin,
  User,
  Phone,
  Building2,
  Mail,
  Clock,
  Package,
  Shield,
  Droplet,
} from "lucide-react";
import { bloodBankService } from "../../../services/bloodBankService";

export default function BloodBankProfilePage() {
  const [bloodBank, setBloodBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: {},
  });

  useEffect(() => {
    const fetchBloodBank = async () => {
      try {
        setLoading(true);
        const res = await bloodBankService.currentBloodBank();
        const bloodBankData = res.results || res;

        if (bloodBankData && bloodBankData.id) {
          setBloodBank(bloodBankData);
          setFormData({
            ...bloodBankData,
            location: bloodBankData.location || {},
            managed_by: bloodBankData.managed_by || {},
          });
          setCreating(false);
        } else {
          setCreating(true);
        }
      } catch (error) {
        console.error("Error fetching blood bank details:", error);
        if (error.response?.status === 404) {
          setCreating(true);
        } else {
          setCreating(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBloodBank();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (creating || !bloodBank?.id) {
        const response = await bloodBankService.createBloodBank(formData);
        setBloodBank(response);
        setCreating(false);
        alert("Blood bank profile created successfully!");
      } else {
        const response = await bloodBankService.updateBloodBank(bloodBank.id, formData);
        setBloodBank(response);
        alert("Blood bank profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving blood bank profile:", error);
      alert("Error saving blood bank profile. Please try again.");
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
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 dark:bg-red-500 p-3 rounded-xl shadow-md">
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {creating ? "Create Blood Bank Profile" : "Blood Bank Profile"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {creating
                  ? "Set up your blood bank profile"
                  : "Manage your blood bank information"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Blood Bank Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Blood Bank Information
              </h2>
            </div>
            <div className="mb-8">
              {/* Blood Bank Name */}
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
                      value={formData.managed_by?.[field] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          managed_by: {
                            ...formData.managed_by,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter blood bank name"
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Storage Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Storage Capacity (Units) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      value={formData.storage_capacity || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          storage_capacity: e.target.value,
                        })
                      }
                      placeholder="Maximum units that can be stored"
                      min="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
                {/* Operating Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Operating Hours <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={formData.operating_hours || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          operating_hours: e.target.value,
                        })
                      }
                      placeholder="e.g., 24/7 or Mon-Fri 9AM-5PM"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active !== undefined ? formData.is_active : true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-red-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Blood Bank is Active
                    </span>
                  </label>
                </div>
              </div>
            </div>

          {/* Contact Person Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contact Person Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={formData.contact_person || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_person: e.target.value,
                      })
                    }
                    placeholder="Enter contact person name"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="tel"
                    value={formData.contact_number || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_number: e.target.value,
                      })
                    }
                    placeholder="Enter contact number"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>
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