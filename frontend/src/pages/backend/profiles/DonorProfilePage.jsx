import React, { useEffect, useState } from "react";
import {
  Loader2,
  Edit3,
  PlusCircle,
  MapPin,
  User,
  Droplet,
  Calendar,
  Weight,
  Activity,
} from "lucide-react";
import { donorService } from "../../../services/donorService";

export default function DonorProfilePage() {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: {},
  });

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        setLoading(true);
        const res = await donorService.currentDonor();
        const donorData = res.results || res;

        if (donorData) {
          setDonor(donorData);
          setFormData({
            ...donorData,
            location: donorData.location || {},
            user: donorData.user || {},
          });
          setCreating(false);
        } else {
          setCreating(true);
        }
      } catch (error) {
        console.error("Error fetching donor details:", error);
        setCreating(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (creating) {
        await donorService.createDonor(formData);
        alert("Donor profile created successfully!");
      } else {
        await donorService.updateDonor(donor.id, formData);
        alert("Donor profile updated successfully!");
      }
    } catch (error) {
      console.log(error.response?.data);
      console.error("Error saving donor profile:", error);
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
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {creating ? "Create Donor Profile" : "Donor Profile"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {creating
                  ? "Set up your blood donation profile"
                  : "Manage your donation information"}
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
            </div>

            {/* Contact Information Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="date"
                      value={formData.date_of_birth || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_of_birth: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      value={formData.weight || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      placeholder="Enter weight"
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

          {/* Donation Details Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Donation Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Last Donation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Donation Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="date"
                    value={formData.last_donation_date || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_donation_date: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Preferred Donation Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Donation Time
                </label>
                <select
                  value={formData.preferred_donation_time || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_donation_time: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select Time</option>
                  <option value="MORNING">Morning (8AM-12PM)</option>
                  <option value="AFTERNOON">Afternoon (12PM-5PM)</option>
                  <option value="EVENING">Evening (5PM-8PM)</option>
                  <option value="ANYTIME">Anytime</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Medical Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical Conditions
                </label>
                <textarea
                  value={formData.medical_conditions || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medical_conditions: e.target.value,
                    })
                  }
                  rows="3"
                  placeholder="List any medical conditions or allergies..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="3"
                  placeholder="Tell us a bit about yourself..."
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors resize-none"
                />
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
                  label: "Address",
                  col: "md:col-span-2",
                  required: true,
                },
                {
                  field: "police_station",
                  label: "Police Station",
                  col: "md:col-span-2",
                },
                { field: "city", label: "City", required: true },
                { field: "state", label: "State", required: true },
                { field: "postal_code", label: "Postal Code", required: true },
                { field: "country", label: "Country", required: true },
              ].map(({ field, label, col, required }) => (
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
                    required={required}
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
