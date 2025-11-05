import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext.jsx";
import { ToastProvider } from "./contexts/ToastContext"; 

import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import ProtectedRoute from "./components/guard/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/backend/Dashboard.jsx";
import UsersPage from "./pages/backend/UsersPage.jsx";
import DonorPage from "./pages/backend/DonorPage.jsx";
import HospitalsPage from "./pages/backend/HospitalPage.jsx";
import BloodBankPage from "./pages/backend/BloodBankPage.jsx";
import ReceiverPage from "./pages/backend/ReceiverPage.jsx";
import RequestPage from "./pages/backend/RequestPage.jsx";
import CampaignPage from "./pages/backend/CampaignPage.jsx";
import ReportPage from "./pages/backend/ReportPage.jsx";
import BloodInventoryPage from "./pages/backend/BloodInventoryPage.jsx";
import DonorProfilePage from "./pages/backend/profiles/DonorProfilePage.jsx";
import ReceiverProfilePage from "./pages/backend/profiles/ReceiverProfilePage.jsx";
import HospitalProfilePage from "./pages/backend/profiles/HospitalProfilePage.jsx";
import BloodBankProfilePage from "./pages/backend/profiles/BloodBankProfilePage.jsx";
import CampaignRegister from "./pages/auth/CampaignRegister.jsx";
import CampaignDonorListPage from "./pages/backend/CampaignDonorListPage.jsx";

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Layout Routes */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />}/>
              </Route>

              {/* Dashboard / Protected Layout Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard"
                  element={
                    <SidebarProvider defaultOpen={true}>
                      <DashboardLayout />
                    </SidebarProvider>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="/dashboard/users" element={<UsersPage />} />
                  <Route path="/dashboard/donors" element={<DonorPage />} />
                  <Route path="/dashboard/hospitals" element={<HospitalsPage />} />
                  <Route path="/dashboard/blood-banks" element={<BloodBankPage />} />
                  <Route path="/dashboard/blood-banks/:bloodBankId/inventory" element={<BloodInventoryPage />} />
                  <Route path="/dashboard/receivers" element={<ReceiverPage />} />
                  <Route path="/dashboard/requests" element={<RequestPage />} />
                  <Route path="/dashboard/campaigns" element={<CampaignPage />} />
                  <Route path="/dashboard/reports" element={<ReportPage />} />
                  <Route path="/dashboard/donor/profile" element={<DonorProfilePage />} />
                  <Route path="/dashboard/receiver/profile" element={<ReceiverProfilePage />} />
                  <Route path="/dashboard/hospital/profile" element={<HospitalProfilePage />} />
                  <Route path="/dashboard/bloodbank/profile" element={<BloodBankProfilePage />} />
                  <Route path="/dashboard/campaign/:campaignId/donors" element={<CampaignDonorListPage />} />
                  <Route path="/dashboard/campaign/:campaignId/register" element={<CampaignRegister />} />
                  
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
