import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider } from "./contexts/SidebarContext.jsx";
import { ToastProvider } from "./contexts/ToastContext"; 

import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import ProtectedRoute from "./components/guard/ProtectedRoute.jsx";
import GuestRoute from "./components/guard/GuestRoute.jsx";

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
                <Route path="register" element={<Register />} />
                <Route path="login" element={
                    <Login />
                }/>
              </Route>

              {/* Dashboard / Protected Layout Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  element={
                    <SidebarProvider defaultOpen={true}>
                      <DashboardLayout />
                    </SidebarProvider>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/donors" element={<DonorPage />} />
                  <Route path="/hospitals" element={<HospitalsPage />} />
                  <Route path="/blood-banks" element={<BloodBankPage />} />
                  <Route path="/blood-banks/:bloodBankId/inventory" element={<BloodInventoryPage />} />
                  <Route path="/receivers" element={<ReceiverPage />} />
                  <Route path="/requests" element={<RequestPage />} />
                  <Route path="/campaigns" element={<CampaignPage />} />
                  <Route path="/reports" element={<ReportPage />} />
                  
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
