import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import { BarChart3, PieChart as PieIcon, Activity } from "lucide-react";
import { analyticService } from "../../services/analyticService";
import { donorService } from "../../services/donorService";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
  const [donationData, setDonationData] = useState([]);
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const response = await analyticService.getAllStats();
        console.log(response);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    const fetchActivityLogs = async () => {
      try {
        const response = await analyticService.getActivityLogs();
        console.log(response);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    }
    const getRequestViewStats = async () => {
      try {
        const response = await analyticService.getRequestViewStats();
        console.log(response);
      } catch (error) {
        console.error('Error fetching request view stats:', error);
      }
    }

    const getNearbyDonors = async () => {
      try {
        const response = await analyticService.getNearbyDonors();
        console.log(response);
      } catch (error) {
        console.error('Error fetching nearby donors:', error);
      }
    }
    const getDonorRecords = async () => {
      try {
        const response = await donorService.getDonorRecords();
        console.log(response);
      } catch (error) {
        console.error('Error fetching donor records:', error);
      }
    }

    fetchAllStats();
    fetchActivityLogs();
    getRequestViewStats();
    getNearbyDonors();
    getDonorRecords();
  }, []);


  useEffect(() => {
    // Sample data – replace with API calls later
    setDonationData([
      { month: "Jan", donations: 120 },
      { month: "Feb", donations: 150 },
      { month: "Mar", donations: 90 },
      { month: "Apr", donations: 170 },
      { month: "May", donations: 130 },
      { month: "Jun", donations: 200 },
    ]);

    setBloodGroupData([
      { name: "A+", value: 40 },
      { name: "A-", value: 15 },
      { name: "B+", value: 25 },
      { name: "B-", value: 10 },
      { name: "O+", value: 60 },
      { name: "O-", value: 20 },
      { name: "AB+", value: 18 },
      { name: "AB-", value: 7 },
    ]);
  }, []);

  
  const COLORS = [
    "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1",
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Reports & Analytics
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={()=>navigate("/dashboard/activity-logs")} className="font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 active:scale-95 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 focus:ring-purple-500/50 px-4 py-2 text-sm">
            View Activity Logs
            <Activity size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donation Trend */}
        <Card>
          <CardHeader title="Monthly Donation Trends" />
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      color: "#f3f4f6",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="donations" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Blood Group Distribution */}
        <Card>
          <CardHeader title="Blood Group Distribution" />
          <CardContent>
            <div className="h-80 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodGroupData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {bloodGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      color: "#f3f4f6",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="text-center">
          <CardHeader title="Total Donations" />
          <CardContent>
            <div className="flex flex-col items-center">
              <BarChart3 className="h-10 w-10 text-blue-500 mb-2" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">760</span>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader title="Active Donors" />
          <CardContent>
            <div className="flex flex-col items-center">
              <Activity className="h-10 w-10 text-green-500 mb-2" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">342</span>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader title="Ongoing Campaigns" />
          <CardContent>
            <div className="flex flex-col items-center">
              <PieIcon className="h-10 w-10 text-rose-500 mb-2" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">12</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
