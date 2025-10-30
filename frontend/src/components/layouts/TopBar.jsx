import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from "../../hooks/useDarkMode";
import { Users, Calendar, Search, Bell, Menu, Moon, Sun, LayoutDashboard, Package, FileText, BarChart3, LogOut, Settings, User } from 'lucide-react';
import { useSidebar } from "../../hooks/useSidebar";

let currentPage = 'dashboard';

export default function TopBar() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const { toggleSidebar } = useSidebar();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Mock notifications data
    const notifications = [
        { id: 1, title: 'New blood request', message: 'O+ blood needed urgently', time: '5 min ago', unread: true },
        { id: 2, title: 'Appointment confirmed', message: 'John Doe - Tomorrow 10:00 AM', time: '1 hour ago', unread: true },
        { id: 3, title: 'Inventory alert', message: 'A+ blood stock is low', time: '2 hours ago', unread: false },
        { id: 4, title: 'New donor registered', message: 'Jane Smith registered as donor', time: '1 day ago', unread: false },
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Notification Dropdown */}
                    <div className="relative" ref={notificationRef}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                        >
                            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                </div>
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                            notification.unread ? 'bg-blue-50 dark:bg-gray-700/50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                            {notification.unread && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {darkMode ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-700" />}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button 
                            onClick={() => setShowProfile(!showProfile)}
                            className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        >
                            <span className="text-sm font-semibold text-gray-700 dark:text-white">AD</span>
                        </button>

                        {showProfile && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">admin@bloodbank.com</p>
                                </div>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                                    <User className="h-4 w-4" />
                                    <span>My Profile</span>
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3">
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}