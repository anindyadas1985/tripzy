import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TripPlanner } from './components/TripPlanner';
import { BookingHub } from './components/BookingHub';
import { NavigationMap } from './components/NavigationMap';
import { TripContext } from './contexts/TripContext';
import { Trip, Booking, TripUpdate } from './types';
import { mockTrips, mockBookings, mockUpdates } from './data/mockData';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'planner' | 'booking' | 'navigation'>('dashboard');
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [updates, setUpdates] = useState<TripUpdate[]>(mockUpdates);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(trips[0] || null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random trip updates
      if (Math.random() > 0.8) {
        const newUpdate: TripUpdate = {
          id: Date.now().toString(),
          tripId: activeTrip?.id || trips[0]?.id,
          type: Math.random() > 0.5 ? 'delay' : 'traffic',
          title: Math.random() > 0.5 ? 'Flight Delayed' : 'Traffic Alert',
          message: Math.random() > 0.5 
            ? 'Your flight has been delayed by 30 minutes' 
            : 'Heavy traffic detected on your route. Alternative route suggested.',
          timestamp: new Date(),
          severity: Math.random() > 0.7 ? 'high' : 'medium'
        };
        setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [activeTrip, trips]);

  const contextValue = {
    trips,
    setTrips,
    bookings,
    setBookings,
    updates,
    setUpdates,
    activeTrip,
    setActiveTrip
  };

  return (
    <TripContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        
        <main className="pt-16">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'planner' && <TripPlanner />}
          {activeView === 'booking' && <BookingHub />}
          {activeView === 'navigation' && <NavigationMap />}
        </main>
      </div>
    </TripContext.Provider>
  );
}

export default App;