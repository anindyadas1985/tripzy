import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, BarChart3, Activity, Database, Settings, 
  AlertTriangle, CheckCircle, Clock, TrendingUp, Server,
  UserCheck, UserX, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTripContext } from '../contexts/TripContext';
import { ADMIN_CONFIG } from '../config/admin';

interface SystemStats {
  totalUsers: number;
  activeTrips: number;
  totalBookings: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastUpdated: Date;
}

interface UserActivity {
  id: string;
  name: string;
  email: string;
  lastActive: Date;
  tripsCount: number;
  status: 'active' | 'inactive' | 'suspended';
}

export const AdminConsole: React.FC = () => {
  const { user } = useAuth();
  const { trips } = useTripContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'system' | 'database'>('overview');
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 1247,
    activeTrips: 89,
    totalBookings: 456,
    systemHealth: 'healthy',
    uptime: '99.9%',
    lastUpdated: new Date()
  });

  const [userActivities] = useState<UserActivity[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tripsCount: 3,
      status: 'active'
    },
    {
      id: '2',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tripsCount: 1,
      status: 'inactive'
    },
    {
      id: '3',
      name: 'Anita Singh',
      email: 'anita@example.com',
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      tripsCount: 5,
      status: 'active'
    }
  ]);

  const refreshStats = () => {
    setSystemStats(prev => ({
      ...prev,
      lastUpdated: new Date()
    }));
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users, enabled: ADMIN_CONFIG.features.userManagement },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp, enabled: ADMIN_CONFIG.features.analytics },
    { id: 'system' as const, label: 'System', icon: Activity, enabled: ADMIN_CONFIG.features.systemHealth },
    { id: 'database' as const, label: 'Database', icon: Database, enabled: ADMIN_CONFIG.features.databaseAdmin }
  ].filter(tab => tab.enabled !== false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
              <p className="text-gray-600">System administration and monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {ADMIN_CONFIG.debugMode && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                Debug Mode
              </span>
            )}
            <button
              onClick={refreshStats}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.activeTrips}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{systemStats.totalBookings}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getHealthColor(systemStats.systemHealth)}`}>
                  {systemStats.systemHealth}
                </span>
              </div>
              <Server className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600 bg-red-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-medium">{systemStats.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">{systemStats.lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Environment</span>
                      <span className="font-medium">{import.meta.env.DEV ? 'Development' : 'Production'}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>New user registration: priya@example.com</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Trip created: Paris Adventure</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span>High API usage detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Export Users
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Trips</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivities.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatLastActive(user.lastActive)}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {user.tripsCount}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">User Growth</h4>
                  <p className="text-3xl font-bold text-blue-600">+23%</p>
                  <p className="text-sm text-gray-600">vs last month</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Trip Completion</h4>
                  <p className="text-3xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-gray-600">success rate</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Revenue</h4>
                  <p className="text-3xl font-bold text-purple-600">₹12.5L</p>
                  <p className="text-sm text-gray-600">this month</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">API Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">245ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requests/min</span>
                      <span className="font-medium">1,247</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Database</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connection Pool</span>
                      <span className="font-medium">8/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Query Time</span>
                      <span className="font-medium">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="font-medium">2.3GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && ADMIN_CONFIG.features.databaseAdmin && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Database Administration</h3>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-orange-600">Use with caution</span>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  Database administration features are restricted and require special permissions.
                  Contact your system administrator for access.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};