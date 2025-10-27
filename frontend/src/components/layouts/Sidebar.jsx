import { useState } from "react";
import {
  Heart,
  Users,
  Calendar,
  Settings,
  X,
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { sidebarOpen, closeSidebar } = useSidebar();
  const { logout } = useAuth();

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", name: "Inventory", icon: Package },
    { id: "donors", name: "Donors", icon: Users },
    { id: "requests", name: "Requests", icon: FileText },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "reports", name: "Reports", icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
  };


  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div
            className={`flex items-center transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {sidebarOpen && (
              <>
                <Heart className="h-8 w-8 text-red-500" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  BloodLink
                </span>
              </>
            )}
          </div>
          {!sidebarOpen && (
            <Heart className="h-8 w-8 text-red-500 mx-auto transition-all duration-300" />
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center ${
                  sidebarOpen ? "px-4 justify-start" : "px-0 justify-center"
                } py-3 rounded-lg transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span
                  className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-500 ${
                    sidebarOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            className={`w-full flex items-center ${
              sidebarOpen ? "px-4 justify-start" : "px-0 justify-center"
            } py-3 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            <span
              className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-500 ${
                sidebarOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Settings
            </span>
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? "px-4 justify-start" : "px-0 justify-center"
            } py-3 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-500 ${
                sidebarOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-500 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              BloodLink
            </span>
          </div>
          <button onClick={closeSidebar}>
            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  closeSidebar();
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="ml-3 font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="h-5 w-5" />
            <span className="ml-3 font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut className="h-5 w-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
