import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, MapPin, Calendar, Filter } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data
  const analyticsData = {
    revenue: {
      current: 2847593,
      previous: 2456789,
      growth: 15.9
    },
    users: {
      current: 12547,
      previous: 10234,
      growth: 22.6
    },
    bookings: {
      current: 15672,
      previous: 13245,
      growth: 18.3
    },
    avgOrderValue: {
      current: 18567,
      previous: 16234,
      growth: 14.4
    }
  };

  const topDestinations = [
    { name: 'Paris, France', bookings: 1247, revenue: 456789 },
    { name: 'Tokyo, Japan', bookings: 892, revenue: 378456 },
    { name: 'London, UK', bookings: 756, revenue: 298765 },
    { name: 'New York, USA', bookings: 634, revenue: 267890 },
    { name: 'Dubai, UAE', bookings: 523, revenue: 234567 }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 234567, bookings: 1234 },
    { month: 'Feb', revenue: 267890, bookings: 1456 },
    { month: 'Mar', revenue: 298765, bookings: 1567 },
    { month: 'Apr', revenue: 345678, bookings: 1789 },
    { month: 'May', revenue: 378456, bookings: 1923 },
    { month: 'Jun', revenue: 456789, bookings: 2145 }
  ];

  const userSegments = [
    { segment: 'Frequent Travelers', count: 2847, percentage: 22.7, revenue: 1234567 },
    { segment: 'Business Travelers', count: 1923, percentage: 15.3, revenue: 987654 },
    { segment: 'Leisure Travelers', count: 6234, percentage: 49.7, revenue: 567890 },
    { segment: 'First-time Users', count: 1543, percentage: 12.3, revenue: 234567 }
  ];

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Comprehensive business insights and metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(analyticsData.revenue.growth)}`}>
              <TrendingUp className="w-4 h-4" />
              <span>+{analyticsData.revenue.growth}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCurrency(analyticsData.revenue.current)}
          </div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(analyticsData.users.growth)}`}>
              <TrendingUp className="w-4 h-4" />
              <span>+{analyticsData.users.growth}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {analyticsData.users.current.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Users</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(analyticsData.bookings.growth)}`}>
              <TrendingUp className="w-4 h-4" />
              <span>+{analyticsData.bookings.growth}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {analyticsData.bookings.current.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Bookings</div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(analyticsData.avgOrderValue.growth)}`}>
              <TrendingUp className="w-4 h-4" />
              <span>+{analyticsData.avgOrderValue.growth}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ₹{analyticsData.avgOrderValue.current.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Avg Order Value</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-400">{data.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                        style={{ width: `${(data.revenue / 500000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-white ml-4">
                  {formatCurrency(data.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Destinations</h3>
          <div className="space-y-4">
            {topDestinations.map((destination, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{destination.name}</div>
                    <div className="text-xs text-gray-400">{destination.bookings} bookings</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-white">
                  {formatCurrency(destination.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Segments */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">User Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userSegments.map((segment, index) => (
            <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="text-lg font-bold text-white mb-1">{segment.count.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mb-2">{segment.segment}</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">{segment.percentage}% of users</div>
                <div className="text-xs font-medium text-green-400">
                  {formatCurrency(segment.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};