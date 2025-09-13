import React from 'react';
import { TripCard } from './TripCard';
import { UpdatesFeed } from './UpdatesFeed';
import { WeatherWidget } from './WeatherWidget';
import { BudgetOverview } from './BudgetOverview';
import { useTripContext } from '../contexts/TripContext';

export const Dashboard: React.FC = () => {
  const { trips, activeTrip } = useTripContext();
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your travels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Trip */}
          {activeTrip && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Current Trip</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Active
                </span>
              </div>
              <TripCard trip={activeTrip} featured />
            </section>
          )}

          {/* Upcoming Trips */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>

          {/* Budget Overview */}
          <BudgetOverview />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WeatherWidget />
          <UpdatesFeed />
        </div>
      </div>
    </div>
  );
};