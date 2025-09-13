import React from 'react';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { Trip } from '../types';
import { useTripContext } from '../contexts/TripContext';

interface TripCardProps {
  trip: Trip;
  featured?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, featured = false }) => {
  const { setActiveTrip } = useTripContext();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = () => {
    const today = new Date();
    const diffTime = trip.startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil();
  const budgetPercentage = (trip.spent / trip.budget) * 100;

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer ${
        featured ? 'ring-2 ring-sky-500/20' : ''
      }`}
      onClick={() => setActiveTrip(trip)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold">{trip.title}</h3>
          <div className="flex items-center space-x-1 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{trip.destination}</span>
          </div>
        </div>
        {daysUntil > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1 text-sm font-medium text-gray-700">
              <Clock className="w-3 h-3" />
              <span>{daysUntil} days</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Budget</span>
            </div>
            <span className="font-medium">
              ${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                budgetPercentage > 90 ? 'bg-red-500' : 
                budgetPercentage > 70 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            trip.status === 'active' ? 'bg-green-100 text-green-800' :
            trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
          
          <span className="text-sm text-sky-600 font-medium hover:text-sky-700">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};