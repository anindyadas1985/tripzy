import React from 'react';
import { AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

export const UpdatesFeed: React.FC = () => {
  const { updates } = useTripContext();
  const recentUpdates = updates.slice(0, 5);

  const getUpdateIcon = (type: string, severity: string) => {
    if (severity === 'high') return AlertTriangle;
    if (type === 'recommendation') return CheckCircle;
    if (type === 'delay') return Clock;
    return Info;
  };

  const getUpdateColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {recentUpdates.map((update) => {
          const Icon = getUpdateIcon(update.type, update.severity);
          const colorClasses = getUpdateColor(update.severity);

          return (
            <div key={update.id} className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {update.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(update.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {update.message}
                </p>

                {update.actionRequired && (
                  <button className="mt-2 text-xs font-medium text-sky-600 hover:text-sky-700">
                    Take Action →
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {recentUpdates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No recent updates</p>
          </div>
        )}
      </div>
    </div>
  );
};