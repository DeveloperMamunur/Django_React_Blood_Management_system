import { Outlet } from "react-router-dom";
import { useSidebar } from "../hooks/useSidebar";
import Sidebar from "../components/layouts/Sidebar";
import TopBar from "../components/layouts/TopBar";

export default function DashboardLayout() {
    const { sidebarOpen } = useSidebar();
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-500 ease-in-out`}>
                <TopBar />
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}