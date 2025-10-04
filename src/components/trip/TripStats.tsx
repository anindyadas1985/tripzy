import React from 'react';
import { IndianRupee, TrendingUp, PieChart, Users, Calendar, MapPin } from 'lucide-react';

interface TripStatsProps {
  totalBudget: number;
  totalSpent: number;
  totalTrips: number;
  activeTravelers: number;
}

export const TripStats: React.FC<TripStatsProps> = ({
  totalBudget,
  totalSpent,
  totalTrips,
  activeTravelers
}) => {
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const stats = [
    {
      icon: PieChart,
      label: 'Total Budget',
      value: `₹${totalBudget.toLocaleString()}`,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: IndianRupee,
      label: 'Remaining',
      value: `₹${remainingBudget.toLocaleString()}`,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: MapPin,
      label: 'Total Trips',
      value: totalTrips.toString(),
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <PieChart className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Trip Statistics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-2 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {totalBudget > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(spentPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                spentPercentage > 90 ? 'bg-red-500' : 
                spentPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};