import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";
import { Eye, Plus, Pencil, Trash2, Droplets, CheckCircle, Clock, XCircle, MapPin, Users, Calendar} from "lucide-react";
import { campaignService } from "../../../services/campaignService";
import { bloodBankService } from "../../../services/bloodBankService";
import CampaignModal from "../../../components/modals/CampaignModal";
import CreateCampaignModal from "../../../components/modals/CreateCampaignModal";

export default function BloodBankCampaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  // Blood bank options
  const [bloodBankOptions, setBloodBankOptions] = useState([]);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await campaignService.getAllCampaigns();
      setCampaigns(res.results || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blood banks
  const fetchBloodBanks = async () => {
    try {
      const res = await bloodBankService.getAllBloodBanks();
      const options = (res.results || res || []).map((bank) => ({
        value: bank.id,
        label: bank.name,
      }));
      setBloodBankOptions(options);
    } catch (err) {
      console.error("Failed to load blood banks:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchBloodBanks();
  }, []);

  const handleView = (id) => {
    setSelectedCampaignId(id);
    setViewModalOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedCampaignId(id);
    setCreateModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await campaignService.deleteCampaign(id);
        await fetchCampaigns();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getProgressPercentage = (registered, max) => {
    return Math.min((registered / max) * 100, 100);
  };


  const getStatusConfig = (status) => {
    const configs = {
      ACTIVE: {
        label: 'Active',
        bgColor: 'bg-green-100 dark:bg-green-900/40',
        textColor: 'text-green-700 dark:text-green-400',
        icon: CheckCircle
      },
      PLANNED: {
        label: 'Upcoming',
        bgColor: 'bg-blue-100 dark:bg-blue-900/40',
        textColor: 'text-blue-700 dark:text-blue-400',
        icon: Clock
      },
      COMPLETED: {
        label: 'Completed',
        bgColor: 'bg-gray-100 dark:bg-gray-700/50',
        textColor: 'text-gray-700 dark:text-gray-400',
        icon: CheckCircle
      },
      CANCELLED: {
        label: 'Cancelled',
        bgColor: 'bg-red-100 dark:bg-red-900/40',
        textColor: 'text-red-700 dark:text-red-400',
        icon: XCircle
      }
    };
    return configs[status] || configs.ACTIVE;
  };

  const handleViewDonors = (id) => {
    navigate(`/dashboard/campaign/${id}/donors`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="dark:text-white text-2xl font-semibold text-center">
          Blood Campaigns
        </h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-5 w-5" /> Create Campaign
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg  bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading campaigns...
          </p>
        ) : campaigns.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No campaigns found.
          </p>
        ) : campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const progressPercentage = getProgressPercentage(
                campaign.registration_count,
                campaign.target_donors
              );
              const statusConfig = getStatusConfig(campaign.status);
              const StatusIcon = statusConfig.icon;
              const isActionable = campaign.status === 'ACTIVE' || campaign.status === 'PLANNED';

              return (
                <div
                  key={campaign.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.banner_image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Badge */}
                    <div
                      className={`absolute top-4 left-4 ${statusConfig.bgColor} backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-md`}
                    >
                      <StatusIcon size={16} className={statusConfig.textColor} />
                      <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Donor Count Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {campaign.registration_count}/{campaign.target_donors} Donors
                      </span>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {campaign.campaign_name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Campaign Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={18} className="text-red-500 dark:text-red-400 shrink-0" />
                        <span className="text-sm">
                          {new Date(campaign.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin size={18} className="text-red-500 dark:text-red-400 shrink-0" />
                        <span className="text-sm line-clamp-1">
                          {campaign.location.city}, {campaign.location.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users size={18} className="text-red-500 dark:text-red-400 shrink-0" />
                        <span className="text-sm">
                          {campaign.organizer?.username || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* Registration Progress */}
                    {isActionable && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Registration Progress
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {progressPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progressPercentage >= 90
                                ? 'bg-orange-500 dark:bg-orange-600'
                                : progressPercentage >= 70
                                ? 'bg-yellow-500 dark:bg-yellow-600'
                                : 'bg-red-500 dark:bg-red-600'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDonors(campaign.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-semibold shadow-md"
                      >
                        <Droplets size={16} />
                        Donors
                      </button>
                      <button
                        onClick={() => handleView(campaign.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-semibold shadow-md"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(campaign.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-semibold shadow-md"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm font-semibold shadow-md"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <CampaignModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedCampaignId(null);
        }}
        campaignId={selectedCampaignId}
      />
      <CreateCampaignModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setSelectedCampaignId(null);
        }}
        campaignId={selectedCampaignId}
        refreshCampaigns={fetchCampaigns}
        bloodBankOptions={bloodBankOptions}
      />
    </div>
  );
}
