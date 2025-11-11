import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import AdminDashboard from "./dashboards/AdminDashboard.jsx";
import DonorDashboard from "./dashboards/DonorDashboard.jsx";
import ReceiverDashboard from "./dashboards/ReceiverDashboard.jsx";
import HospitalDashboard from "./dashboards/HospitalDashboard.jsx";
import BloodBankDashboard from "./dashboards/BloodBankDashboard.jsx";

export default function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  switch (currentUser.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "DONOR":
      return <DonorDashboard />;
    case "RECEIVER":
      return <ReceiverDashboard />;
    case "HOSPITAL":
      return <HospitalDashboard />;
    case "BLOOD_BANK":
      return <BloodBankDashboard />;
    default:
      return <div className="p-6 text-center">Unknown role</div>;
  }
}