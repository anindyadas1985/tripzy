import React from 'react';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

export const BudgetOverview: React.FC = () => {
  const { trips } = useTripContext();

  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalSpent = trips.reduce((sum, trip) => sum + trip.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  const categories = [
    { name: 'Flights', amount: 1450, color: 'bg-sky-500', percentage: 45 },
    { name: 'Hotels', amount: 1050, color: 'bg-green-500', percentage: 32 },
    { name: 'Activities', amount: 450, color: 'bg-orange-500', percentage: 14 },
    { name: 'Food', amount: 300, color: 'bg-purple-500', percentage: 9 }
  ];

  return (
    <section>
      <div className="flex items-center space-x-2 mb-4">
        <PieChart className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Spent</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-lg mx-auto mb-2">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${remainingBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        <div className="mb-6">
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

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Spending by Category</h4>
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  ₹{category.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};