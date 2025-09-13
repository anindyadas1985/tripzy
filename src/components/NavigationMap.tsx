import React, { useState } from 'react';
import { Navigation2, MapPin, Clock, Route, AlertTriangle, Phone } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface RouteStep {
  id: string;
  instruction: string;
  distance: string;
  duration: string;
  type: 'straight' | 'left' | 'right' | 'continue';
}

export const NavigationMap: React.FC = () => {
  const { activeTrip } = useTripContext();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentDestination, setCurrentDestination] = useState('Hotel Le Marais');

  const mockRouteSteps: RouteStep[] = [
    {
      id: '1',
      instruction: 'Head northeast on Rue de Rivoli toward Place de la Bastille',
      distance: '0.3 km',
      duration: '2 min',
      type: 'straight'
    },
    {
      id: '2',
      instruction: 'Turn right onto Rue Saint-Antoine',
      distance: '0.5 km',
      duration: '3 min',
      type: 'right'
    },
    {
      id: '3',
      instruction: 'Continue straight for 200m',
      distance: '0.2 km',
      duration: '1 min',
      type: 'continue'
    },
    {
      id: '4',
      instruction: 'Turn left onto Rue des Rosiers - Destination will be on your right',
      distance: '0.1 km',
      duration: '1 min',
      type: 'left'
    }
  ];

  const trafficAlerts = [
    {
      id: '1',
      type: 'construction',
      message: 'Road work on Rue de Rivoli may cause delays',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'accident',
      message: 'Minor incident reported on Boulevard Saint-Germain',
      severity: 'low'
    }
  ];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'left': return '↰';
      case 'right': return '↱';
      case 'continue': return '↑';
      default: return '→';
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Navigation</h1>
        <p className="text-gray-600">Real-time turn-by-turn directions with traffic updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Map Placeholder */}
            <div className="h-96 bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-sky-600 mx-auto mb-2" />
                <p className="text-gray-600">Interactive Map</p>
                <p className="text-sm text-gray-500 mt-1">Current location: Paris, France</p>
              </div>

              {/* Current location marker */}
              <div className="absolute top-20 left-20">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="text-xs text-blue-600 font-medium mt-1">You</div>
              </div>

              {/* Destination marker */}
              <div className="absolute bottom-20 right-20">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                <div className="text-xs text-red-600 font-medium mt-1">Hotel</div>
              </div>

              {/* Route line simulation */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <path
                  d="M 80 80 Q 200 150 320 320"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Map Controls */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation2 className="w-5 h-5 text-sky-600" />
                  <span className="font-medium text-gray-900">To: {currentDestination}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {!isNavigating ? (
                    <button
                      onClick={handleStartNavigation}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                    >
                      Start Navigation
                    </button>
                  ) : (
                    <button
                      onClick={handleStopNavigation}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Stop Navigation
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900">7 min</div>
                  <div className="text-gray-600">ETA</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">1.1 km</div>
                  <div className="text-gray-600">Distance</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">12:34</div>
                  <div className="text-gray-600">Arrival</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Panel */}
        <div className="space-y-6">
          {/* Traffic Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Traffic Alerts</h3>
            </div>

            <div className="space-y-3">
              {trafficAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg ${
                  alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                  alert.severity === 'medium' ? 'bg-orange-50 border border-orange-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Turn-by-Turn Directions */}
          {isNavigating && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Route className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-semibold text-gray-900">Directions</h3>
              </div>

              <div className="space-y-3">
                {mockRouteSteps.map((step, index) => (
                  <div key={step.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    index === 0 ? 'bg-sky-50 border border-sky-200' : 'hover:bg-gray-50'
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                      index === 0 ? 'bg-sky-600' : 'bg-gray-400'
                    }`}>
                      <span className="text-lg">{getStepIcon(step.type)}</span>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1">{step.instruction}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <span>{step.distance}</span>
                        <span>•</span>
                        <span>{step.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5 text-sky-600" />
                <div>
                  <div className="font-medium text-gray-900">Call Hotel</div>
                  <div className="text-sm text-gray-600">+33 1 42 74 23 45</div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Nearby Places</div>
                  <div className="text-sm text-gray-600">Restaurants, attractions, services</div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Share ETA</div>
                  <div className="text-sm text-gray-600">Let others know when you'll arrive</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};