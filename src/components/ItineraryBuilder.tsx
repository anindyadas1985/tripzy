import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Star, Plus } from 'lucide-react';
import { SearchFilters, ItineraryItem } from '../types';

interface ItineraryBuilderProps {
  filters: SearchFilters;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ filters }) => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  // Mock generated itinerary items
  const suggestedItems: ItineraryItem[] = [
    {
      id: '1',
      type: 'flight',
      title: 'Flight to Paris',
      description: 'Direct flight from JFK to Charles de Gaulle',
      startTime: new Date(filters.dates.start.getTime() + 8 * 60 * 60 * 1000),
      endTime: new Date(filters.dates.start.getTime() + 14 * 60 * 60 * 1000),
      location: 'Charles de Gaulle Airport',
      cost: 650,
      status: 'pending'
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Le Marais Boutique Hotel',
      description: 'Charming hotel in historic district',
      startTime: new Date(filters.dates.start.getTime() + 15 * 60 * 60 * 1000),
      endTime: new Date(filters.dates.end.getTime() + 11 * 60 * 60 * 1000),
      location: '4th Arrondissement, Paris',
      cost: 180,
      status: 'pending'
    },
    {
      id: '3',
      type: 'activity',
      title: 'Eiffel Tower Visit',
      description: 'Skip-the-line tickets with guided tour',
      startTime: new Date(filters.dates.start.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
      endTime: new Date(filters.dates.start.getTime() + 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
      location: 'Champ de Mars, Paris',
      cost: 35,
      status: 'pending'
    }
  ];

  const addToItinerary = (item: ItineraryItem) => {
    setItinerary(prev => [...prev, { ...item, status: 'booked' }]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'hotel': return '🏨';
      case 'activity': return '🎭';
      case 'transport': return '🚗';
      default: return '📍';
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Your AI-Generated Itinerary
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Optimized for time & budget</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-600">Destination</div>
            <div className="font-medium">{filters.destination}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-600">Duration</div>
            <div className="font-medium">
              {Math.ceil((filters.dates.end.getTime() - filters.dates.start.getTime()) / (1000 * 60 * 60 * 24))} days
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-600">Travelers</div>
            <div className="font-medium">{filters.travelers}</div>
          </div>
        </div>
      </div>

      {/* Suggested Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Activities</h3>
        
        <div className="space-y-4">
          {suggestedItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">{getTypeIcon(item.type)}</span>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {item.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(item.startTime)} • {formatTime(item.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${item.cost}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToItinerary(item)}
                  className="flex items-center space-x-1 px-3 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Itinerary */}
      {itinerary.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Itinerary</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>Optimized route</span>
            </div>
          </div>

          <div className="space-y-3">
            {itinerary.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-700">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(item.type)}</span>
                    <span className="font-medium text-gray-900">{item.title}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDate(item.startTime)} • {formatTime(item.startTime)}
                  </div>
                </div>

                <div className="text-sm font-medium text-gray-900">
                  ${item.cost}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total Cost</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{itinerary.reduce((sum, item) => sum + item.cost, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};