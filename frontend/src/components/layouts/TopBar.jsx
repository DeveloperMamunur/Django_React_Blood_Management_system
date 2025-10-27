import { useDarkMode } from "../../hooks/useDarkMode";
import {  Users, Calendar, Search, Bell,  Menu,  Moon, Sun, LayoutDashboard, Package,  FileText, BarChart3 } from 'lucide-react';
import { useSidebar } from "../../hooks/useSidebar";

let currentPage = 'dashboard';

export default function TopBar() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const { toggleSidebar } = useSidebar();


    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventory', name: 'Inventory', icon: Package },
        { id: 'donors', name: 'Donors', icon: Users },
        { id: 'requests', name: 'Requests', icon: FileText },
        { id: 'appointments', name: 'Appointments', icon: Calendar },
        { id: 'reports', name: 'Reports', icon: BarChart3 },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
            <div className="flex justify-between items-center h-16 px-4">
                <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
                    {navItems.find(item => item.id === currentPage)?.name || 'Dashboard'}
                </h2>
                </div>

                <div className="flex items-center space-x-3">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-64"
                    />
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {darkMode ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-700" />}
                </button>
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-semibold text-gray-700 dark:text-white">AD</span>
                </div>
                </div>
            </div>
        </div>
    );
}