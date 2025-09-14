import React from 'react';
import { Users, Building2, MapPin, Calendar, DollarSign, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export const Dashboard: React.FC = () => {
  const { stats } = useAdmin();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Vendors',
      value: stats.totalVendors.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Trips',
      value: stats.totalTrips.toLocaleString(),
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: MapPin,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Bookings',
      value: stats.totalBookings.toLocaleString(),
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      change: '+18.9%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+5.3%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'user_registration',
      message: 'New user registered: priya.sharma@email.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: 'info'
    },
    {
      id: '2',
      type: 'booking_created',
      message: 'High-value booking created: ₹85,000 trip to Europe',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'success'
    },
    {
      id: '3',
      type: 'vendor_verification',
      message: 'Vendor verification pending: Royal Palace Hotel',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: 'warning'
    },
    {
      id: '4',
      type: 'system_alert',
      message: 'Database backup completed successfully',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      severity: 'info'
    }
  ];

  const systemAlerts = [
    {
      id: '1',
      title: 'High API Usage',
      message: 'Google Maps API usage is at 85% of monthly limit',
      severity: 'warning' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Vendor Verification Queue',
      message: '12 vendors pending verification review',
      severity: 'info' as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200';
      case 'error': return 'bg-red-500/20 border-red-500/30 text-red-200';
      default: return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor and manage the Journai Travel Platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(activity.severity)}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">System Alerts</h3>
          </div>
          
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{alert.title}</h4>
                  <span className="text-xs opacity-75">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-sm opacity-90">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-sm text-gray-400">API Status</div>
            <div className="text-green-400 font-medium">Healthy</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-sm text-gray-400">Database</div>
            <div className="text-green-400 font-medium">Healthy</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-sm text-gray-400">Storage</div>
            <div className="text-yellow-400 font-medium">Warning</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-sm text-gray-400">Services</div>
            <div className="text-green-400 font-medium">Healthy</div>
          </div>
        </div>
      </div>
    </div>
  );
};