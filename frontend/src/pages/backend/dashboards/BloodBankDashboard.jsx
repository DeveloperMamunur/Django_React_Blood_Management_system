import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, Clock, XCircle, Eye, Pencil, Trash2, Droplets, Users, Plus, Droplet, Heart, Croissant, CrossIcon, CheckCheck, CheckCheckIcon, Activity } from 'lucide-react';
import { campaignService } from '../../../services/campaignService';
import { useNavigate } from "react-router-dom";
import CampaignModal from '../../../components/modals/CampaignModal';
import CreateCampaignModal from '../../../components/modals/CreateCampaignModal';
import { bloodBankService } from '../../../services/bloodBankService';
import { Button } from '../../../components/ui';



export default function BloodBankDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [bloodBankOptions, setBloodBankOptions] = useState([]);
  const [currentBloodBank, setCurrentBloodBank] = useState(null);

  const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await campaignService.allCampaigns();
        console.log(res.results);
        setCampaigns(res.results || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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

  useEffect(() => {
    const currentBloodBank = async () => {
      try {
        const res = await bloodBankService.currentBloodBank();
        const bloodBankData = res.results || res;

        if (bloodBankData) {
          setCurrentBloodBank(bloodBankData);
        }
      } catch (error) {
        console.error("Error fetching current blood bank:", error);
      }
    };

    currentBloodBank();
  }, []);



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

  const handleViewDonors = (id) => {
    navigate(`/dashboard/campaign/${id}/donors`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Blood Bank Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to your blood bank dashboard!
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-5 w-5" /> Create Campaign
          </Button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white my-4">Campaigns</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 my-6">
          <div className="bg-amber-700 dark:bg-amber-600 text-white hover:bg-amber-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">Total Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {campaigns?.length || 0}
              </p>
            </div>
          </div>
          <div className="bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <h3 className="text-lg font-semibold">Upcoming Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {campaigns.filter((campaign) => campaign.status === 'PLANNED').length}
              </p>
            </div>
          </div>
          <div className="bg-purple-500 dark:bg-purple-600 text-white hover:bg-purple-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Clock size={24} />
              <h3 className="text-lg font-semibold">Active Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {campaigns.filter((campaign) => campaign.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
          <div className="bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle size={24} />
              <h3 className="text-lg font-semibold">Completed Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {campaigns?.filter((campaign) => campaign.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
          <div className="bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <XCircle size={24} />
              <h3 className="text-lg font-semibold">Cancelled Campaigns</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {campaigns?.filter((campaign) => campaign.status === 'CANCELLED').length}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white my-4">Blood Inventory</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 my-6">
          <div className="bg-amber-700 dark:bg-amber-600 text-white hover:bg-amber-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">Total Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.reduce((total, bloodType) => total + bloodType.units_available, 0) || 0}
              </p>
            </div>
          </div>
          <div className="bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">A+ Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'A+')?.units_available || 0}
              </p>
            </div>
          </div>
          <div className="bg-purple-500 dark:bg-purple-600 text-white hover:bg-purple-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">A- Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'A-')?.units_available || 0}
              </p>
            </div>
          </div>
          <div className="bg-pink-500 dark:bg-pink-600 text-white hover:bg-pink-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">B+ Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'B+')?.units_available || 0}
              </p>
            </div>
          </div> 
          <div className="bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">B- Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'B-')?.units_available || 0}
              </p>
            </div>
          </div>
          <div className="bg-cyan-500 dark:bg-cyan-600 text-white hover:bg-cyan-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">AB+ Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'AB+')?.units_available || 0}
              </p>
            </div>
          </div>
          <div className="bg-orange-500 dark:bg-orange-600 text-white hover:bg-orange-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">AB- Blood Units</h3>
            </div>
            <div className='mt-2'>
              <p className='text-2xl font-bold text-white dark:text-gray-200'>
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'AB-')?.units_available || 0}
              </p>
            </div>
          </div>
          <div className="bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">O+ Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'O+')?.units_available || 0}
              </p>
            </div>
          </div>
          <div className="bg-pink-500 dark:bg-pink-600 text-white hover:bg-pink-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Droplet size={24} />
              <h3 className="text-lg font-semibold">O- Blood Units</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white dark:text-gray-200">
                {currentBloodBank?.inventory?.find((bloodType) => bloodType.blood_group === 'O-')?.units_available || 0}
              </p>
            </div>
          </div>
        </div>
        {/* Campaign List Header */}  
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Campaign List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your blood donation campaigns
          </p>
        </div>
        {/* Campaign Cards Grid */}
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

        {/* Empty State */}
        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No campaigns found. Create your first campaign to get started!
            </p>
          </div>
        )}
      </div>
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