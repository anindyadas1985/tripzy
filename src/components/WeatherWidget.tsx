import React from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

export const WeatherWidget: React.FC = () => {
  const { activeTrip } = useTripContext();

  // Mock weather data - in a real app, this would come from a weather API
  const mockWeatherData = {
    location: activeTrip?.destination || 'Paris, France',
    current: {
      temp: 18,
      condition: 'Partly Cloudy',
      icon: Cloud
    },
    forecast: [
      { day: 'Today', high: 22, low: 15, icon: Sun },
      { day: 'Tomorrow', high: 19, low: 12, icon: CloudRain },
      { day: 'Thu', high: 24, low: 16, icon: Sun },
      { day: 'Fri', high: 20, low: 14, icon: Cloud }
    ]
  };

  const CurrentIcon = mockWeatherData.current.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Thermometer className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{mockWeatherData.location}</span>
          <CurrentIcon className="w-6 h-6 text-gray-600" />
        </div>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-gray-900">
            {mockWeatherData.current.temp}°
          </span>
          <span className="text-sm text-gray-600">C</span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          {mockWeatherData.current.condition}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">4-Day Forecast</h4>
        {mockWeatherData.forecast.map((day, index) => {
          const DayIcon = day.icon;
          return (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600 w-16">{day.day}</span>
              <DayIcon className="w-4 h-4 text-gray-500" />
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-900">{day.high}°</span>
                <span className="text-gray-500">{day.low}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};