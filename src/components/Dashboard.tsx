import React from 'react';
import { TripCard } from './trip/TripCard';
import { UpdatesFeed } from './UpdatesFeed';
import { WeatherWidget } from './WeatherWidget';
import { TripStats } from './trip/TripStats';
import { QuickActions } from './QuickActions';
import { TripTimeline } from './TripTimeline';
import { EmptyState } from './common/EmptyState';
import { useTripContext } from '../contexts/TripContext';
import { Plus, MapPin, Calendar, Plane, Mic } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { trips, activeTrip, setActiveTrip } = useTripContext();
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming' || trip.status === 'planning');
  const activeTrips = trips.filter(trip => trip.status === 'active');
  
  const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalSpent = trips.reduce((sum, trip) => sum + trip.spent, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Your travel command center</p>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="Ready for your next adventure?"
          description="Create your first trip and let our AI generate the perfect itinerary for you."
          action={{
            label: "Create Your First Trip",
            onClick: () => window.dispatchEvent(new CustomEvent('navigate-to-create'))
          }}
        />
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
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onClick={() => setActiveTrip(trip)}
                    />
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

            {/* Trip Statistics */}
            {trips.length > 0 && (
              <TripStats
                totalBudget={totalBudget}
                totalSpent={totalSpent}
                totalTrips={trips.length}
                activeTravelers={trips.reduce((sum, trip) => sum + trip.travelers, 0)}
              />
            )}
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