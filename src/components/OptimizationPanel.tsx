import React from 'react';
import { Zap, Clock, DollarSign, Route, AlertCircle } from 'lucide-react';

export const OptimizationPanel: React.FC = () => {
  const optimizations = [
    {
      icon: Clock,
      title: 'Time Optimization',
      description: 'Reduced travel time by 2.5 hours',
      status: 'applied',
      color: 'green'
    },
    {
      icon: DollarSign,
      title: 'Budget Optimization',
      description: 'Found $340 in savings',
      status: 'applied',
      color: 'green'
    },
    {
      icon: Route,
      title: 'Route Optimization',
      description: 'Optimized for minimal walking distance',
      status: 'suggested',
      color: 'blue'
    },
    {
      icon: AlertCircle,
      title: 'Conflict Detection',
      description: 'No scheduling conflicts found',
      status: 'clear',
      color: 'gray'
    }
  ];

  const insights = [
    {
      title: 'Peak Season Alert',
      message: 'You\'re traveling during peak season. Book accommodations early for better rates.',
      severity: 'medium'
    },
    {
      title: 'Weather Consideration',
      message: 'Pack light rain gear - 30% chance of rain during your visit.',
      severity: 'low'
    },
    {
      title: 'Local Events',
      message: 'Fashion Week is happening during your stay. Expect higher hotel prices.',
      severity: 'high'
    }
  ];

  const getStatusColor = (status: string, color: string) => {
    if (status === 'applied') return 'bg-green-100 text-green-800';
    if (status === 'suggested') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Optimization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">AI Optimizations</h3>
        </div>

        <div className="space-y-4">
          {optimizations.map((opt, index) => {
            const Icon = opt.icon;
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  opt.color === 'green' ? 'bg-green-100' : 
                  opt.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    opt.color === 'green' ? 'text-green-600' :
                    opt.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{opt.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opt.status, opt.color)}`}>
                      {opt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{opt.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Insights</h3>

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`border-l-4 pl-4 py-2 ${getSeverityColor(insight.severity)}`}>
              <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-600">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Metrics</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Optimization Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="w-14 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">87%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time Efficiency</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="w-12 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">78%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Budget Adherence</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="w-15 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">94%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Preference Match</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="w-13 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">82%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};