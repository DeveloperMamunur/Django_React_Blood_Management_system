import {useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Droplet,
  CheckCircle,
  AlertCircle,
  Heart,
} from "lucide-react";
import { campaignService } from "../../services/campaignService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CampaignRegister() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    campaign: campaignId,
    preferred_time_slot: "",
    notes: "",
  });
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchCampaign = async (id) => {
      setLoading(true);
      setError("");
      try {
        const data = await campaignService.currentCampaign(id);
        setCampaign(data);
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to fetch campaign. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) fetchCampaign(campaignId);
  }, [campaignId]);

  const availableSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await campaignService.createCampaignRegistrationDonor(campaignId, {
        preferred_time_slot: formData.preferred_time_slot,
        notes: formData.notes,
      });
      setRegistered(true);
    } catch (err) {
      console.error("Error registering campaign:", err);
      alert("Failed to register campaign. Please try again later.");
    } 
  };

  useEffect(() => {
    if (!campaign) return;

    if (campaign.registered_donors >= campaign.target_donors) {
      alert("Campaign is full");
      navigate("/dashboard");
    }
    if (campaign.registrations) {
      alert("You have already registered for this campaign");
      navigate("/dashboard");
    }
    if (registered) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [campaign, navigate, registered]);

  // Loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-lg dark:text-gray-400">Loading campaign details...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // Success confirmation
  if (registered) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg shadow-lg p-12 text-center dark:bg-gray-800">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-900/30">
            <CheckCircle className="w-14 h-14 text-green-400" />
          </div>
          <h2 className="text-4xl font-bold mb-3 dark:text-white">
            Registration Successful!
          </h2>
          <p className="text-lg mb-8 dark:text-gray-400">
            Your registration has been confirmed. Check your email for details.
          </p>
          <div className="rounded-lg p-6 bg-blue-900/20 border dark:border-gray-700">
            <p className="text-sm flex items-center justify-center gap-2 dark:text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              Please arrive 10 minutes before your scheduled time slot
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
        {/* Header */}
        <div className="bg-red-500 px-8 py-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
          </div>
          <div className="relative flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Droplet className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Campaign Registration
              </h1>
              <p className="text-red-100 text-lg">
                Every drop counts. Register to save lives.
              </p>
            </div>
          </div>
        </div>

        {/* Form start */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold mb-3 dark:text-white">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaign?.campaign_name || ""}
              readOnly
              className="w-full px-4 py-3 rounded-lg border dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Campaign Info */}
          <div className="rounded-lg p-6 border dark:bg-gray-900 dark:border-gray-700">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg dark:text-white">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Campaign Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-wide dark:text-gray-400">
                    Location
                  </p>
                  <p className="font-medium dark:text-white">
                    {campaign?.address_line1}, {campaign?.city}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Calendar className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-wide dark:text-gray-400">
                    Date
                  </p>
                  <p className="font-medium dark:text-white">
                    {campaign?.start_date
                      ? new Date(campaign.start_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                      - {campaign?.end_date
                      ? new Date(campaign.end_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <div className="p-2 rounded-lg bg-red-100">
                  <Clock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-wide dark:text-gray-400">
                    Time
                  </p>
                  <p className="font-medium dark:text-white">
                    {campaign?.start_date
                      ? new Date(campaign.start_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )
                      : "N/A"}
                      -
                    {campaign?.end_date
                      ? new Date(campaign.end_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-semibold mb-4 dark:text-white">
              Choose Your Time Slot <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleChange("preferred_time_slot", slot)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.preferred_time_slot === slot
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock
                        className={`w-5 h-5 ${
                          formData.preferred_time_slot === slot
                            ? "text-red-500"
                            : "dark:text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          formData.preferred_time_slot === slot
                            ? "text-red-600 dark:text-red-400"
                            : "dark:text-white"
                        }`}
                      >
                        {slot}
                      </span>
                    </div>
                    {formData.preferred_time_slot === slot && (
                      <CheckCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-3 dark:text-white">
              Additional Notes{" "}
              <span className="dark:text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Medical conditions, allergies, or special requirements..."
              className="w-full px-4 py-3 rounded-lg transition-all resize-none border dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
              rows="4"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-lg bg-red-500 hover:bg-red-600 text-white transition-transform transform hover:scale-105"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}
