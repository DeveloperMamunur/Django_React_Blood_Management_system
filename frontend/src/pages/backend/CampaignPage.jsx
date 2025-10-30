import { useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { Eye } from "lucide-react";
import { campaignService } from "../../services/campaignService";
import CampaignModal from "../../components/modals/CampaignModal";

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignService.getAllCampaigns();
        setCampaigns(res.results || res || []);
      } catch (error) {
        console.error("Error loading campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      console.log("Deleting campaign ID:", id);
      // Add delete API call here later
    }
  };

  const handleView = (id) => {
    setSelectedCampaignId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCampaignId(null);
  };

  return (
    <div className="p-6">
      <h1 className="dark:text-white text-2xl font-semibold text-center mb-6">
        Blood Drive Campaigns
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow">
        {loading ? (
          <p className="text-center py-6 text-gray-600 dark:text-gray-300">
            Loading campaigns...
          </p>
        ) : campaigns?.length === 0 ? (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No campaigns found.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Name</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Organizer</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Location</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Status</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">Start Date</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700">End Date</th>
                <th className="p-3 text-left font-semibold border-b border-gray-300 dark:border-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 text-gray-700 dark:text-gray-200">{campaign.campaign_name}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{campaign.organizer?.username || "—"}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {campaign.location
                      ? `${campaign.location.city}, ${campaign.location.state}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{campaign.status}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {new Date(campaign.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">
                    {new Date(campaign.end_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button variant="primary" size="xs" onClick={() => handleView(campaign.id)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="danger" size="xs" onClick={() => handleDelete(campaign.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CampaignModal isOpen={modalOpen} onClose={closeModal} campaignId={selectedCampaignId} />
    </div>
  );
}
