import { Users, Droplet, Calendar, Activity, TrendingUp, AlertCircle, CheckCircle, Clock, Plus, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bloodBankService } from '../../../services/bloodBankService';
import { userService } from '../../../services/userService';
import { requestService } from '../../../services/requestService';
import { calculateTotalUnits } from '../../../utils/bloodUtils';
export default function Dashboard () {
    const [bloodBank, setBloodBank] = useState([]);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [inventories, setInventories] = useState([]);
    

    const fetchBloodBank = async () => {
        try {
            const data = await bloodBankService.getAllBloodBanks();
            setBloodBank(data.results || data);
        } catch (error) {
            console.error("Failed to fetch blood bank:", error);
        }
    };

    useEffect(() => {
        fetchBloodBank();
    }, []);

    const totalUnits = bloodBank ? calculateTotalUnits(bloodBank) : 0;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                setUsers(data.results || data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await requestService.getAllRequests();
                setRequests(data.results || data);
            } catch (error) {
                console.error("Failed to fetch requests:", error);
            }
        };
        fetchRequests();
    }, []);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await bloodBankService.allBloodsInventory();
                console.log(data);
                setInventories(data);
            } catch (error) {
                console.error("Failed to fetch inventory:", error);
            }
        };
        fetchInventory();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            FULL: 'bg-green-600',
            GOOD: 'bg-green-500',
            NORMAL: 'bg-blue-500',
            LOW: 'bg-yellow-500', 
            CRITICAL: 'bg-red-600',

            URGENT: 'bg-orange-500', 
            EMERGENCY: 'bg-red-700',
            ROUTINE: 'bg-blue-500', 

            PENDING: 'bg-yellow-500',
            APPROVED: 'bg-green-500', 
            CONFIRMED: 'bg-green-600',
            FULFILLED: 'bg-green-600',
            COMPLETED: 'bg-gray-500', 
            CANCELLED: 'bg-red-500', 
            REJECTED: 'bg-red-500', 
        };
        return colors[status] || 'bg-gray-500';
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your blood bank today.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">New Donation</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Units</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                       {totalUnits}
                    </p>
                    <p className="text-green-500 text-sm mt-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +12% this month
                    </p>
                    </div>
                    <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg">
                    <Droplet className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Donors</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {users.filter((user) => user.role === 'DONOR').length}
                    </p>
                    <p className="text-green-500 text-sm mt-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +8% this month
                    </p>
                    </div>
                    <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
                    <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {requests.filter((request) => request.status === 'PENDING').length}
                    </p>
                    <p className="text-yellow-500 text-sm mt-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        8 urgent
                    </p>
                    </div>
                    <div className="bg-yellow-500 bg-opacity-20 p-4 rounded-lg">
                    <Activity className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today's Appointments</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</p>
                    <p className="text-green-500 text-sm mt-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        9 confirmed
                    </p>
                    </div>
                    <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg">
                    <Calendar className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Blood Inventory Status</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {inventories?.group_totals?.map((inventory) => (
                    <div key={inventory.blood_group} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{inventory.blood_group}</div>
                        <div className={`text-3xl font-bold mb-2 ${inventory.total_available < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {inventory.total_available}
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Critical Alerts</h2>
                <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                        <p className="font-semibold text-red-800 dark:text-red-400">Critical: B- Blood Type</p>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">Only 8 units remaining. Immediate restocking required.</p>
                        </div>
                    </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                        <p className="font-semibold text-red-800 dark:text-red-400">Critical: AB- Blood Type</p>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">Only 5 units remaining. Urgent donation drive needed.</p>
                        </div>
                    </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                        <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-400">Low: A- Blood Type</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">12 units remaining. Consider scheduling donors.</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Requests</h2>
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Hospital</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Blood Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Units</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Priority</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.slice(0, 4).map((request) => (
                        <tr key={request.id} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-3 text-gray-900 dark:text-gray-300">{request.hospital_name}</td>
                            <td className="px-4 py-3">
                                <span className="font-semibold text-red-500">{request.blood_group}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-gray-300">{request.units_required}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(request.urgency)} text-white`}>
                                    {request.urgency}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(request.status)} text-white`}>
                                    {request.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};
