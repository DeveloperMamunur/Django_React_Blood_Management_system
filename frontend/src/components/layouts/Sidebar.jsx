import {
  Heart,
  Users,
  Calendar,
  Settings,
  X,
  LayoutDashboard,
  Package,
  FileText,
  HeartHandshake,
  BarChart3,
  LogOut,
  Hospital,
  Droplet,
  UserRound,
  Megaphone,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, closeSidebar } = useSidebar();
  const { currentUser, logout } = useAuth();

  const role = currentUser?.role || '';

  const navItems = [
    { id: 1, link: "/dashboard", name: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "RECEIVER", "HOSPITAL", "BLOOD_BANK", "DONOR"] },
    { id: 2, link: "/dashboard/users", name: "Users", icon: Users, roles: ["ADMIN"] },
    { id: 3, link: "/dashboard/donors", name: "Donors", icon: HeartHandshake, roles: ["ADMIN"] },
    { id: 4, link: "/dashboard/hospitals", name: "Hospitals", icon: Hospital, roles: ["ADMIN"]},
    { id: 5, link: "/dashboard/blood-banks", name: "Blood Banks", icon: Droplet, roles: ["ADMIN"] },
    { id: 6, link: "/dashboard/receivers", name: "Receivers", icon: UserRound, roles: ["ADMIN"] },
    { id: 7, link: "/dashboard/requests", name: "Requests", icon: FileText, roles: ["ADMIN", "RECEIVER", "HOSPITAL", "DONOR"] },
    { id: 8, link: "/dashboard/campaigns", name: "Campaigns", icon: Megaphone, roles: ["ADMIN", "BLOOD_BANK"] },
    { id: 9, link: "/dashboard/reports", name: "Reports", icon: BarChart3, roles: ["ADMIN"]},
    { id: 10, link: "/dashboard/blood-banks/inventory", name: "Inventory", icon: Package, roles: ["ADMIN"] },
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
        <Link to="/" className="flex items-center justify-between p-4 border-b border-gray-700">
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
        </Link>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems
          .filter(item => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.link}
                className={`w-full flex items-center ${
                  sidebarOpen ? "px-4 justify-start" : "px-0 justify-center"
                } py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.link
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
              </Link>
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
              <Link
                key={item.id}
                to={item.link}
                onClick={closeSidebar}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.link
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="ml-3 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="h-5 w-5" />
            <span className="ml-3 font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}