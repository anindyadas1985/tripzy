import React from 'react';
import { Plus, Search, MapPin, CreditCard, Share2, Download, Receipt } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: Plus,
      title: 'Create Trip',
      description: 'Start planning a new adventure',
      color: 'from-sky-500 to-blue-600',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-create'))
    },
    {
      icon: Search,
      title: 'Find Deals',
      description: 'Search flights & hotels',
      color: 'from-green-500 to-emerald-600',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-booking'))
    },
    {
      icon: MapPin,
      title: 'Navigate',
      description: 'Get directions',
      color: 'from-purple-500 to-violet-600',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-navigation'))
    },
    {
      icon: Share2,
      title: 'Share Trip',
      description: 'Share with friends',
      color: 'from-orange-500 to-red-500',
      action: () => {}
    },
    {
      icon: Receipt,
      title: 'Split Expenses',
      description: 'Track shared costs',
      color: 'from-pink-500 to-rose-500',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-expenses'))
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{action.title}</h4>
              <p className="text-xs text-gray-600">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};