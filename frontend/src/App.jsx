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
                <Route path="/dashboard"
                  element={
                    <SidebarProvider defaultOpen={true}>
                      <DashboardLayout />
                    </SidebarProvider>
                  }
                >
                  <Route index element={<Dashboard />} />
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
