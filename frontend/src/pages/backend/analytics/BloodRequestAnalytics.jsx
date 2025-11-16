import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, TrendingUp, Users, Activity } from 'lucide-react';
import { analyticService } from '../../../services/analyticService';

const BloodRequestAnalytics = () => {
  const [requestViews, setRequestViews] = useState([]);
  const [topRequests, setTopRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch request views (daily stats)
        const viewsResponse = await analyticService.getRequestStates();
        console.log('Views Response:', viewsResponse);
        setRequestViews(viewsResponse.results || viewsResponse || []);

        // Fetch top requests statistics
        const statsResponse = await analyticService.getRequestViewStats();
        console.log('Stats Response:', statsResponse);
        setTopRequests(statsResponse.results || statsResponse || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bloodTypeDistribution = React.useMemo(() => {
    const bloodTypeCounts = {};
    const colors = {
      'A+': '#ef4444', 'A-': '#dc2626',
      'B+': '#10b981', 'B-': '#059669',
      'O+': '#f59e0b', 'O-': '#d97706',
      'AB+': '#3b82f6', 'AB-': '#2563eb'
    };

    topRequests.forEach(stat => {
      stat?.top_requests?.forEach(request => {
        const bloodType = request.blood_group;
        bloodTypeCounts[bloodType] = (bloodTypeCounts[bloodType] || 0) + request.views;
      });
    });

    return Object.entries(bloodTypeCounts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#6b7280'
    }));
  }, [topRequests]);

  const viewerTypes = React.useMemo(() => {
    const totalViews = requestViews.reduce((sum, day) => sum + (day.total_views || 0), 0);
    const totalUniqueViewers = requestViews.reduce((sum, day) => sum + (day.unique_viewers || 0), 0);
    
    const estimatedAnonymous = Math.max(0, totalViews - totalUniqueViewers);
    const registeredPercentage = totalViews > 0 ? ((totalUniqueViewers / totalViews) * 100).toFixed(0) : 0;
    const anonymousPercentage = totalViews > 0 ? ((estimatedAnonymous / totalViews) * 100).toFixed(0) : 0;

    return [
      { name: 'Registered', value: parseInt(registeredPercentage) },
      { name: 'Anonymous', value: parseInt(anonymousPercentage) }
    ];
  }, [requestViews]);

  const totalViews = requestViews.reduce((sum, day) => sum + (day.total_views || 0), 0);
  const avgDailyViews = requestViews.length > 0 ? Math.round(totalViews / requestViews.length) : 0;
  
  const todayViews = requestViews.length > 0 ? (requestViews[requestViews.length - 1]?.total_views || 0) : 0;
  
  const viewGrowth = requestViews.length > 1 
    ? ((todayViews - (requestViews[requestViews.length - 2]?.total_views || 0)) / (requestViews[requestViews.length - 2]?.total_views || 1) * 100).toFixed(1)
    : 0;

  const latestStats = topRequests.length > 0 ? topRequests[0] : null;
  const topRequestsList = latestStats?.top_requests || [];
  const latestTotalViews = latestStats?.total_views || 0;
  
  const uniqueViewers = requestViews.reduce((sum, day) => sum + (day.unique_viewers || 0), 0);

  const quickStats = React.useMemo(() => {
    const avgViewsPerRequest = topRequestsList.length > 0 
      ? (latestTotalViews / topRequestsList.length).toFixed(1) 
      : 0;
    
    const bounceRate = uniqueViewers > 0 
      ? (((totalViews - uniqueViewers) / totalViews) * 100).toFixed(1) 
      : 0;
    
    const peakHour = "2:00 PM - 3:00 PM";
    
    const returnRate = uniqueViewers > 0 
      ? (((totalViews - uniqueViewers) / totalViews) * 100).toFixed(1) 
      : 0;
    
    return {
      avgViewsPerRequest,
      bounceRate,
      peakHour,
      returnRate
    };
  }, [topRequestsList, latestTotalViews, totalViews, uniqueViewers]);

  const StatCard = ({ icon, label, value, change, changeLabel }) => {
    const Icon = icon;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          {change !== undefined && change !== null && (
            <div className={`flex items-center text-sm ${parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{parseFloat(change) >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </div>
        {changeLabel && (
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {changeLabel}
          </div>
        )}
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="px-4 sm:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blood Request Analytics
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track and analyze blood request views and engagement
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Eye}
            label="Total Views (7 days)"
            value={totalViews}
            change={parseFloat(viewGrowth)}
            changeLabel="vs. previous day"
          />
          <StatCard
            icon={Activity}
            label="Today's Views"
            value={todayViews}
          />
          <StatCard
            icon={TrendingUp}
            label="Average Daily Views"
            value={avgDailyViews}
          />
          <StatCard
            icon={Users}
            label="Unique Viewers"
            value={uniqueViewers}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Views Trend (Last 7 Days)
            </h2>
            {requestViews.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={requestViews}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="date" 
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total_views" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total Views"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  {requestViews[0]?.unique_viewers !== undefined && (
                    <Line 
                      type="monotone" 
                      dataKey="unique_viewers" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Unique Viewers"
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No view data available
              </div>
            )}
          </div>

          {/* Blood Type Distribution */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Blood Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Requests Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Viewed Blood Requests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Most viewed requests in the last 24 hours
            </p>
          </div>
          <div className="overflow-x-auto">
            {topRequestsList.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Engagement
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {topRequestsList.map((request, index) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        <div className="flex items-center">
                          <span className={`${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-700'} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                        {request?.request_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {request?.patient_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                          {request?.blood_group}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-gray-500" />
                          {request?.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${topRequestsList[0]?.views ? (request?.views / topRequestsList[0]?.views) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No top requests data available
              </div>
            )}
          </div>
        </div>

        {/* Viewer Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Viewer Types
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={viewerTypes}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Views per Request</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {quickStats.avgViewsPerRequest}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(100 - parseFloat(quickStats.bounceRate)).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Unique Viewers</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {uniqueViewers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Most Viewed Request</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {topRequestsList[0]?.views || 0} views
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Blood Types</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {bloodTypeDistribution.length} types
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestAnalytics;