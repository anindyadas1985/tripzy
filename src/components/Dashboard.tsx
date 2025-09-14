import React from 'react';
import { TripCard } from './TripCard';
import { UpdatesFeed } from './UpdatesFeed';
import { WeatherWidget } from './WeatherWidget';
import { BudgetOverview } from './BudgetOverview';
import { QuickActions } from './QuickActions';
import { TripTimeline } from './TripTimeline';
import { useTripContext } from '../contexts/TripContext';
import { Plus, MapPin, Calendar, Plane, Mic } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { trips, activeTrip, setActiveTrip } = useTripContext();
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming' || trip.status === 'planning');
  const activeTrips = trips.filter(trip => trip.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Your travel command center</p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
            <Plane className="w-12 h-12 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for your next adventure?</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first trip and let our AI generate the perfect itinerary for you.
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-create'))}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-sky-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Trips */}
            {activeTrips.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Active Trips</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Live
                  </span>
                </div>
                <div className="space-y-4">
                  {activeTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Trips */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Trips</h2>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-create'))}
                  className="flex items-center space-x-1 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Trip</span>
                </button>
              </div>
              
              {upcomingTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h3>
                  <p className="text-gray-600 mb-4">Start planning your next adventure</p>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-create'))}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Trip</span>
                  </button>
                </div>
              )}
            </section>

            {/* Trip Timeline */}
            {activeTrip && <TripTimeline trip={activeTrip} />}

            {/* Budget Overview */}
            {trips.length > 0 && <BudgetOverview />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            <WeatherWidget />
            <UpdatesFeed />
          </div>
        </div>
      )}
    </div>
  );
};