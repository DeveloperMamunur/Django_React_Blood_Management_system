import { useEffect, useState } from "react";
import { campaignService } from "../../services/campaignService";
import Modal from "./Modal";
import { useAuth } from "../../hooks/useAuth";
import { MapPin } from "lucide-react";
import { bloodBankService } from "../../services/bloodBankService";

export default function CreateCampaignModal({ isOpen, onClose, campaignId, refreshCampaigns}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [formData, setFormData] = useState({
    campaign_name: "",
    description: "",
    venue_details: "",
    start_date: "",
    end_date: "",
    target_donors: "",
    status: "PLANNED",
    location: {
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: ""
    },
    banner_image: null,
    blood_banks_involved: [],
  });

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const res = await bloodBankService.allBloodBanksList();
        if (Array.isArray(res)) {
          setBloodBanks(res);
        } else if (res && typeof res === 'object') {
          setBloodBanks(res.results || []);
        } else {
          setBloodBanks([]);
        }
      } catch (err) {
        console.error("Failed to fetch blood banks", err);
        setBloodBanks([]);
      }
    };
    fetchBloodBanks();
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);

        if (campaignId) {
          const campaignData = await campaignService.getCampaignById(campaignId);
          setFormData({
            campaign_name: campaignData.campaign_name || "",
            description: campaignData.description || "",
            venue_details: campaignData.venue_details || "",
            start_date: campaignData.start_date || "",
            end_date: campaignData.end_date || "",
            target_donors: campaignData.target_donors || "",
            status: campaignData.status || "PLANNED",
            location: campaignData.location || {
              address_line1: "",
              address_line2: "",
              city: "",
              state: "",
              postal_code: "",
              country: ""
            },
            blood_banks_involved: Array.isArray(campaignData.blood_banks_involved) 
              ? campaignData.blood_banks_involved 
              : [],
          });
          setCreating(false);
        } else {
          setCreating(true);
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        setCreating(true);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCampaign();
    }
  }, [campaignId, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("campaign_name", formData.campaign_name);
    data.append("description", formData.description);
    data.append("venue_details", formData.venue_details);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("target_donors", formData.target_donors);
    data.append("status", formData.status);
    Object.entries(formData.location).forEach(([key, value]) => {
      data.append(`location.${key}`, value || "");
    });
    if (formData.banner_image instanceof File) {
      data.append("banner_image", formData.banner_image);
    }
    formData.blood_banks_involved.forEach((bankId) => {
      data.append("blood_banks_involved", bankId);
    });

    try {
      if (campaignId) {
        await campaignService.updateCampaign(campaignId, data);
        console.log("Campaign updated successfully!");
      } else {
        await campaignService.createCampaign(data);
        console.log("Campaign created successfully!");
      }
      if (refreshCampaigns) {
        await refreshCampaigns();
      }

     setFormData({
        campaign_name: "",
        description: "",
        start_date: "",
        end_date: "",
        venue_details: "",
        target_donors: 100,
        status: "PLANNED",
        location: {
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Bangladesh",
        },
        blood_banks_involved: "",
        banner_image: null,
      });

    onClose();
  } catch (error) {
    console.error("Error creating campaign:", error.response?.data || error);
  }
};

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} modalSize="3xl" title="Loading...">
        <div className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading campaign...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      modalSize="3xl" 
      title={campaignId ? "Edit Campaign" : "Create Campaign"}
    >
      <div className="p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {creating ? "Create New Campaign" : "Edit Campaign"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="campaign_name"
              value={formData.campaign_name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Organizer Info */}
          {currentUser && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-200">
                Organizer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    USERNAME
                  </label>
                  <input
                    type="text"
                    value={currentUser.username || ""}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    EMAIL
                  </label>
                  <input
                    type="text"
                    value={currentUser.email || ""}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    value={currentUser.first_name || ""}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    value={currentUser.last_name || ""}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    value={currentUser.phone_number || ""}
                    readOnly
                    className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location Section */}
          <div className="border-t pt-4 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Location Details
              </h2>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Venue Details
              </label>
              <input
                type="text"
                name="venue_details"
                value={formData.venue_details}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={formData.location[field]}
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
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 dark:scheme-dark focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 dark:scheme-dark focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* Target Donors */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Donors
            </label>
            <input
              type="number"
              name="target_donors"
              value={formData.target_donors}
              onChange={handleChange}
              min="0"
              className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Banner Image */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Banner Image
            </label>
            <input
              type="file"
              name="banner_image"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  banner_image: e.target.files[0] || null,
                }))
              }
              className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

          </div>

          {/* Blood Banks Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blood Banks Involved (Hold Ctrl/Cmd to select multiple)
            </label>
            <select
              multiple
              size="5"
              name="blood_banks_involved"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 dark:scheme-dark focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={formData.blood_banks_involved}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setFormData(prev => ({ ...prev, blood_banks_involved: selected }));
              }}
            >
              {bloodBanks.map((b) => (
                <option 
                  key={b.id} 
                  value={b.id}
                  className="py-1 hover:bg-blue-100 dark:hover:bg-gray-600"
                >
                  {b.name}
                </option>
              ))}
            </select>
            {formData.blood_banks_involved.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Selected: {formData.blood_banks_involved.length} blood bank(s)
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              {creating ? "Create Campaign" : "Update Campaign"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}