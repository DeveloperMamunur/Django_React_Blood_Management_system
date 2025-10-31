import React, { useEffect, useState } from "react";
import {
  Loader2,
  Edit3,
  PlusCircle,
  MapPin,
  User,
  Droplet,
  Phone,
  FileText,
} from "lucide-react";
import { receiverService } from "../../../services/receiverService";

export default function ReceiverProfilePage() {
  const [receiver, setReceiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    location: {},
  });



  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        setLoading(true);
        const res = await receiverService.currentReceiver();
        const receiverData = res.results || res;

        if (receiverData) {
          setReceiver(receiverData);
          setFormData({
            ...receiverData,
            location: receiverData.location || {},
            user: receiverData .user || {},
          });
          setCreating(false);
        } else {
          setCreating(true);
        }
      } catch (error) {
        console.error("Error fetching receiver details:", error);
        setCreating(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReceiver();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (creating) {
        await receiverService.createReceiver(formData);
      } else {
        await receiverService.updateReceiver(receiver.id, formData);
      }
    } catch (error) {
      console.error("Error saving receiver profile:", error);
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
                {creating ? "Create Receiver Profile" : "Receiver Profile"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {creating
                  ? "Set up your blood receiver profile"
                  : "Manage your receiver information"}
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
              {/* Full Name */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                  {
                    field: "first_name",
                    label: "First Name"
                  },
                  {
                    field: "last_name",
                    label: "Last Name"
                  },
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
                
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="Enter age"
                  min="0"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <select
                    value={formData.blood_group || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, blood_group: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                </div>
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
              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number
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
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Emergency Contact
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
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Additional Information
              </h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="4"
                placeholder="Any additional notes or information..."
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors resize-none"
              />
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
                  field: "address_line2",
                  label: "Address Line 2",
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
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {creating ? (
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