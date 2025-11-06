import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui";
import { Eye, Plus, Pencil, Trash2, Droplets, } from "lucide-react";
import { campaignService } from "../../services/campaignService";
import { bloodBankService } from "../../services/bloodBankService";
import CampaignModal from "../../components/modals/CampaignModal";
import CreateCampaignModal from "../../components/modals/CreateCampaignModal";

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading campaigns...
          </p>
        ) : campaigns.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No campaigns found.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">
                  Name
                </th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">
                  Organizer
                </th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">
                  Location
                </th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">
                  Status
                </th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">
                  Start Date
                </th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">
                  End Date
                </th>
                <th className="p-3 text-center font-semibold border-b border-gray-300 dark:border-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {campaign.campaign_name}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {campaign.organizer?.username || "—"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {campaign.location
                      ? `${campaign.location.police_station}, ${campaign.location.city}, ${campaign.location.state}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {campaign.status}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {new Date(campaign.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {new Date(campaign.end_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Link
                      to={`/dashboard/campaign/${campaign.id}/donors`}
                      className="font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 active:scale-95 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 focus:ring-purple-500/50 px-4 py-2 text-sm"
                    >
                      <Droplets className="h-4 w-4" />Donors
                    </Link>
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleView(campaign.id)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleEdit(campaign.id)}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={() => handleDelete(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
