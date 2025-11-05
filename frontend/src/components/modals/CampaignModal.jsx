import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "../ui/Button";
import { campaignService } from "../../services/campaignService";

export default function CampaignModal({ campaignId, isOpen, onClose }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId || !isOpen) return;

    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await campaignService.getCampaignById(campaignId);
        setCampaign(res);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Campaign Details"
      modalSize="4xl"
      className="dark:bg-gray-900 dark:text-gray-100 bg-white text-gray-900"
    >
      {loading ? (
        <p className="text-center py-6 text-gray-700 dark:text-gray-300">
          Loading campaign details...
        </p>
      ) : !campaign ? (
        <p className="text-center py-6 text-gray-600 dark:text-gray-400">
          No campaign data found.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
            <table className="min-w-full border-collapse text-sm">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="p-3 font-semibold w-1/3">Campaign Name</td>
                  <td className="p-3">{campaign.campaign_name}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Organizer</td>
                  <td className="p-3">{campaign.organizer?.username || "—"}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Description</td>
                  <td className="p-3">{campaign.description}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Venue</td>
                  <td className="p-3">{campaign.venue_details}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Location</td>
                  <td className="p-3">
                    {campaign.location
                      ? `${campaign.location.address_line1}, ${campaign.location.city}, ${campaign.location.state}`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Target Donors</td>
                  <td className="p-3">{campaign.target_donors}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Status</td>
                  <td className="p-3">{campaign.status}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Start Date</td>
                  <td className="p-3">
                    {new Date(campaign.start_date).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">End Date</td>
                  <td className="p-3">
                    {new Date(campaign.end_date).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Blood Banks Involved</td>
                  <td className="p-3">
                      {campaign.blood_banks_involved_details && campaign.blood_banks_involved_details.length > 0
                        ? campaign.blood_banks_involved_details.map((b) => b.name).join(", ")
                        : "No blood banks linked"}
                    </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Completion Rate</td>
                  <td className="p-3">
                    {campaign.completion_rate
                      ? `${campaign.completion_rate.toFixed(1)}%`
                      : "0%"}
                  </td>
                </tr>
                {campaign.banner_image && (
                  <tr>
                    <td className="p-3 font-semibold">Banner</td>
                    <td className="p-3">
                      <img
                        src={campaign.banner_image}
                        alt="Campaign Banner"
                        className="w-64 h-32 object-cover rounded-lg border"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
