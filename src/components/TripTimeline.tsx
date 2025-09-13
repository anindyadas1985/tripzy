import React from 'react';
import { Clock, MapPin, Plane, Building, Activity, Coffee } from 'lucide-react';
import { Trip } from '../types';

interface TripTimelineProps {
  trip: Trip;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ trip }) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'train': return Plane;
      case 'bus': return Plane;
      case 'hotel': return Building;
      case 'activity': return Activity;
      case 'meal': return Coffee;
      default: return MapPin;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-sky-500';
      case 'train': return 'bg-green-500';
      case 'bus': return 'bg-orange-500';
      case 'hotel': return 'bg-purple-500';
      case 'activity': return 'bg-pink-500';
      case 'meal': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const groupedItems = trip.itinerary.reduce((groups, item) => {
    const date = item.startTime.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, typeof trip.itinerary>);

  return (
    <section>
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Trip Timeline</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {Object.entries(groupedItems).map(([date, items]) => (
          <div key={date} className="mb-8 last:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDate(new Date(date))}
              </h3>
            </div>

            <div className="ml-6 space-y-4">
              {items.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).map((item) => {
                const Icon = getItemIcon(item.type);
                const colorClass = getItemColor(item.type);

                return (
                  <div key={item.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`flex-shrink-0 w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(item.startTime)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            item.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'suggested' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                          
                          <span className="text-sm font-medium text-gray-900">
                            ${item.cost}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {trip.itinerary.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No itinerary yet</h3>
            <p className="text-gray-600">Start planning to see your timeline</p>
          </div>
        )}
      </div>
    </section>
  );
};