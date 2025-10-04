import React, { useState } from 'react';
import { Clock, MapPin, Plane, Building, Activity, Coffee, Bus, Train, Car, Bike, Navigation, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import { Trip } from '../types';

interface TripTimelineProps {
  trip: Trip;
}

interface TransportRoute {
  id: string;
  mode: 'bike_taxi' | 'cab' | 'metro' | 'bus' | 'train' | 'auto' | 'walk';
  name: string;
  duration: string;
  distance: string;
  cost: number;
  steps: string[];
  availability: 'available' | 'limited' | 'unavailable';
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ trip }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'bike_taxi': return <Bike className="w-4 h-4" />;
      case 'cab': return <Car className="w-4 h-4" />;
      case 'metro': return <Train className="w-4 h-4" />;
      case 'bus': return <Bus className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      case 'auto': return <Car className="w-4 h-4" />;
      case 'walk': return <Navigation className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const generateTransportOptions = (from: string, to: string): TransportRoute[] => {
    return [
      {
        id: '1',
        mode: 'metro',
        name: 'Metro',
        duration: '25-30 min',
        distance: '12 km',
        cost: 40,
        steps: [
          `Walk to nearest metro station (5 min)`,
          `Take Blue Line towards ${to}`,
          `Change at Central Station to Red Line`,
          `Get off at ${to} station`,
          `Walk to destination (8 min)`
        ],
        availability: 'available'
      },
      {
        id: '2',
        mode: 'cab',
        name: 'Cab (Ola/Uber)',
        duration: '20-25 min',
        distance: '12 km',
        cost: 250,
        steps: [
          `Book cab from your location`,
          `Direct ride to destination`,
          `Estimated fare: ₹200-300 depending on traffic`
        ],
        availability: 'available'
      },
      {
        id: '3',
        mode: 'bike_taxi',
        name: 'Bike Taxi (Rapido)',
        duration: '18-22 min',
        distance: '12 km',
        cost: 120,
        steps: [
          `Book bike taxi from app`,
          `Fastest route via expressway`,
          `Direct drop at destination`
        ],
        availability: 'available'
      },
      {
        id: '4',
        mode: 'bus',
        name: 'Public Bus',
        duration: '35-45 min',
        distance: '14 km',
        cost: 25,
        steps: [
          `Walk to bus stop (3 min)`,
          `Take Bus #42 or #58`,
          `Get off at ${to} bus stand`,
          `Walk to destination (10 min)`
        ],
        availability: 'available'
      },
      {
        id: '5',
        mode: 'auto',
        name: 'Auto Rickshaw',
        duration: '25-30 min',
        distance: '12 km',
        cost: 180,
        steps: [
          `Hail auto from street or use app`,
          `Direct ride to destination`,
          `Fare by meter + 20% extra (usual practice)`
        ],
        availability: 'available'
      }
    ];
  };

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
              {items.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).map((item, index) => {
                const Icon = getItemIcon(item.type);
                const colorClass = getItemColor(item.type);
                const isExpanded = expandedItems.has(item.id);
                const nextItem = items[index + 1];
                const transportOptions = nextItem ? generateTransportOptions(item.location, nextItem.location) : [];

                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors">
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

                            <span className="text-sm font-medium text-gray-900 flex items-center">
                              <IndianRupee className="w-3 h-3" />{item.cost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transport Options Section */}
                    {nextItem && (
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => toggleItemExpansion(item.id)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2 text-sm font-medium text-sky-600">
                            <Navigation className="w-4 h-4" />
                            <span>How to get to {nextItem.title}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3">
                            <div className="text-xs text-gray-500 mb-2">
                              From: {item.location} → To: {nextItem.location}
                            </div>
                            {transportOptions.map((route) => (
                              <div
                                key={route.id}
                                className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0 w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600">
                                      {getTransportIcon(route.mode)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900 text-sm">{route.name}</div>
                                      <div className="text-xs text-gray-500">{route.distance} • {route.duration}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-gray-900 flex items-center text-sm">
                                      <IndianRupee className="w-3 h-3" />{route.cost}
                                    </div>
                                    <div className={`text-xs ${
                                      route.availability === 'available' ? 'text-green-600' :
                                      route.availability === 'limited' ? 'text-orange-600' :
                                      'text-red-600'
                                    }`}>
                                      {route.availability}
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-10 space-y-1">
                                  {route.steps.map((step, idx) => (
                                    <div key={idx} className="text-xs text-gray-600 flex items-start">
                                      <span className="mr-2 text-gray-400">{idx + 1}.</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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