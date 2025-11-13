import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, User, Shield, AlertCircle, CheckCircle, XCircle, FileText, LogOut, UserCheck, ThumbsUp, Droplet, Package, Megaphone, Eye, Filter, Search, LogIn, UserPlus, ShieldCheck, ShieldAlert, FilePlus, Ban, FileEdit, RotateCcw, Heart } from "lucide-react";
import { analyticService } from "../../../services/analyticService";

export default function ActivityLogs() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  useEffect(() => {
      const fetchActivityLogs = async () => {
          setLoading(true);
          try {
            const response = await analyticService.getActivityLogs(page, searchTerm, filterAction);
            setActivityLogs(response.results);
            setTotalCount(response.count);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
          } catch (error) {
            console.error('Error fetching activity logs:', error);
          } finally {
            setLoading(false);
          }
      };

      fetchActivityLogs();
  }, [page, searchTerm, filterAction]);

  const getActionConfig = (action) => {
    const configs = {
      USER_LOGIN: {
        icon: <LogIn className="w-5 h-5" />,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/50',
        bgBorder: 'border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
      },
      USER_LOGOUT: {
        icon: <LogOut className="w-5 h-5" />,
        color: 'text-gray-600 dark:text-gray-400',
        bgLight: 'bg-gray-50 dark:bg-gray-900/50',
        bgBorder: 'border-gray-200 dark:border-gray-700',
        badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
      },
      USER_REGISTERED: {
        icon: <UserPlus className="w-5 h-5" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgLight: 'bg-blue-50 dark:bg-blue-950/50',
        bgBorder: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      },
      USER_LOGIN_FAILED: {
        icon: <AlertCircle className="w-5 h-5" />,
        color: 'text-red-600 dark:text-red-400',
        bgLight: 'bg-red-50 dark:bg-red-950/50',
        bgBorder: 'border-red-200 dark:border-red-800',
        badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
      },
      USER_CREATED: {
        icon: <UserPlus className="w-5 h-5" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgLight: 'bg-blue-50 dark:bg-blue-950/50',
        bgBorder: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      },
      DONOR_VERIFIED: {
        icon: <ShieldCheck className="w-5 h-5" />,
        color: 'text-green-600 dark:text-green-400',
        bgLight: 'bg-green-50 dark:bg-green-950/50',
        bgBorder: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      },
      DONOR_UNVERIFIED: {
        icon: <ShieldAlert className="w-5 h-5" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgLight: 'bg-orange-50 dark:bg-orange-950/50',
        bgBorder: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
      },
      BLOOD_BANK_VERIFIED: {
        icon: <ShieldCheck className="w-5 h-5" />,
        color: 'text-green-600 dark:text-green-400',
        bgLight: 'bg-green-50 dark:bg-green-950/50',
        bgBorder: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      },
      BLOOD_BANK_UNVERIFIED: {
        icon: <ShieldAlert className="w-5 h-5" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgLight: 'bg-orange-50 dark:bg-orange-950/50',
        bgBorder: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
      },
      HOSPITAL_VERIFIED: {
        icon: <ShieldCheck className="w-5 h-5" />,
        color: 'text-green-600 dark:text-green-400',
        bgLight: 'bg-green-50 dark:bg-green-950/50',
        bgBorder: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      },
      HOSPITAL_UNVERIFIED: {
        icon: <ShieldAlert className="w-5 h-5" />,
        color: 'text-orange-600 dark:text-orange-400',
        bgLight: 'bg-orange-50 dark:bg-orange-950/50',
        bgBorder: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
      },
      REQUEST_CREATED: {
        icon: <FilePlus className="w-5 h-5" />,
        color: 'text-purple-600 dark:text-purple-400',
        bgLight: 'bg-purple-50 dark:bg-purple-950/50',
        bgBorder: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
      },
      REQUEST_APPROVED: {
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-green-600 dark:text-green-400',
        bgLight: 'bg-green-50 dark:bg-green-950/50',
        bgBorder: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
      },
      REQUEST_REJECTED: {
        icon: <XCircle className="w-5 h-5" />,
        color: 'text-red-600 dark:text-red-400',
        bgLight: 'bg-red-50 dark:bg-red-950/50',
        bgBorder: 'border-red-200 dark:border-red-800',
        badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
      },
      REQUEST_CANCELLED: {
        icon: <Ban className="w-5 h-5" />,
        color: 'text-gray-600 dark:text-gray-400',
        bgLight: 'bg-gray-50 dark:bg-gray-900/50',
        bgBorder: 'border-gray-200 dark:border-gray-700',
        badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
      },
      REQUEST_UPDATED: {
        icon: <FileEdit className="w-5 h-5" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgLight: 'bg-blue-50 dark:bg-blue-950/50',
        bgBorder: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      },
      REQUEST_RESET: {
        icon: <RotateCcw className="w-5 h-5" />,
        color: 'text-amber-600 dark:text-amber-400',
        bgLight: 'bg-amber-50 dark:bg-amber-950/50',
        bgBorder: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
      },
      DONATION_COMPLETED: {
        icon: <Heart className="w-5 h-5" />,
        color: 'text-rose-600 dark:text-rose-400',
        bgLight: 'bg-rose-50 dark:bg-rose-950/50',
        bgBorder: 'border-rose-200 dark:border-rose-800',
        badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
      },
      INVENTORY_UPDATED: {
        icon: <Package className="w-5 h-5" />,
        color: 'text-amber-600 dark:text-amber-400',
        bgLight: 'bg-amber-50 dark:bg-amber-950/50',
        bgBorder: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
      },
      CAMPAIGN_CREATED: {
        icon: <Megaphone className="w-5 h-5" />,
        color: 'text-pink-600 dark:text-pink-400',
        bgLight: 'bg-pink-50 dark:bg-pink-950/50',
        bgBorder: 'border-pink-200 dark:border-pink-800',
        badge: 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300'
      }
    };
    return configs[action] || configs.USER_LOGIN;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      DONOR: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      RECEIVER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    };
    return colors[role] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const totalPages = Math.ceil(totalCount / 20);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-8"></div>
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Activity Logs</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Monitor system activities and user actions in real-time</p>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{totalCount} Total Entries</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Live Monitoring</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="USER_LOGIN">User Login</option>
              <option value="USER_LOGOUT">User Logout</option>
              <option value="USER_REGISTERED">User Registered</option>
              <option value="DONOR_VERIFIED">Donor Verified</option>
              <option value="DONATION_COMPLETED">Donation Completed</option>
              <option value="CAMPAIGN_CREATED">Campaign Created</option>
            </select>
          </div>
        </div>

        {/* Activity Log Cards */}
        <div className="space-y-4">
          {activityLogs.map((log) => {
            const config = getActionConfig(log.action);
            return (
              <div key={log.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`shrink-0 w-12 h-12 rounded-lg ${config.bgLight} border ${config.bgBorder} flex items-center justify-center ${config.color}`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${config.badge}`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          {log.user && (
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(log.user.role)}`}>
                              {log.user.role}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                          {new Date(log.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <p className="text-gray-900 dark:text-gray-100 mb-3 font-medium leading-relaxed">{log.description}</p>

                      {/* User Info */}
                      {log.user && (
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {log.user.first_name[0]}{log.user.last_name[0]}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-200">{log.user.first_name} {log.user.last_name}</span>
                          </div>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <span className="text-gray-500 dark:text-gray-500">@{log.user.username}</span>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <span className="text-gray-500 dark:text-gray-500">{log.user.email}</span>
                        </div>
                      )}

                      {/* Meta Info & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded">IP: {log.ip_address}</span>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded">ID: #{log.id}</span>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">
                              +{Object.keys(log.metadata).length} metadata
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {selectedLog?.id === log.id ? 'Hide' : 'View'} Details
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {selectedLog?.id === log.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Additional Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User Agent</p>
                              <p className="text-sm text-gray-900 dark:text-gray-200 break-all">{log.user_agent}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timestamp</p>
                              <p className="text-sm text-gray-900 dark:text-gray-200">{new Date(log.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Metadata</p>
                              <div className="space-y-1">
                                {Object.entries(log.metadata).map(([key, value]) => (
                                  <div key={key} className="flex items-center gap-2 text-sm">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">{key}:</span>
                                    <span className="text-gray-900 dark:text-gray-200">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Page <span className="text-gray-900 dark:text-white font-bold">{page}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span> 
              <span className="ml-2 text-gray-500">({totalCount} entries)</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Previous Button */}
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={!hasPrevious}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const showPages = 5; // Number of page buttons to show
                  let startPage = Math.max(1, page - Math.floor(showPages / 2));
                  let endPage = Math.min(totalPages, startPage + showPages - 1);
                  
                  // Adjust start if we're near the end
                  if (endPage - startPage < showPages - 1) {
                    startPage = Math.max(1, endPage - showPages + 1);
                  }

                  // First page + ellipsis
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setPage(1)}
                        className="w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      );
                    }
                  }

                  // Page numbers
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                          page === i
                            ? 'bg-blue-600 dark:bg-blue-500 text-white border-2 border-blue-600 dark:border-blue-500'
                            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Ellipsis + last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setPage(totalPages)}
                        className="w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNext}
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}