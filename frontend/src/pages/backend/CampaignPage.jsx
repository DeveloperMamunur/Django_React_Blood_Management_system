import AdminCampaign from "./campaigns/AdminCampaign";
import BloodBankCampaign from "./campaigns/BloodBankCampaign";
import CampaignListForDonor from "./campaigns/CampaignListForDonor";
import { useAuth } from "../../hooks/useAuth";

export default function CampaignPage() {
  const { currentUser } = useAuth();
  
  switch (currentUser.role) {
    case 'ADMIN':
      return <AdminCampaign />;
    case 'BLOOD_BANK':
      return <BloodBankCampaign />;
    case 'DONOR':
      return <CampaignListForDonor />;
    default:
      return <div className="p-6 text-center">Unknown role</div>;
  }
}
