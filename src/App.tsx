import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TripCreator } from './components/TripCreator';
import { TripPlanner } from './components/TripPlanner';
import { BookingHub } from './components/BookingHub';
import { NavigationMap } from './components/NavigationMap';
import { UserProfile } from './components/UserProfile';
import { TripProvider } from './contexts/TripContext';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'planner' | 'booking' | 'navigation' | 'profile'>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <TripProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {!isOnline && (
          <div className="bg-orange-500 text-white text-center py-2 text-sm font-medium">
            You're offline. Some features may be limited.
          </div>
        )}
        
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        
        <main className={`${!isOnline ? 'pt-20' : 'pt-16'}`}>
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'create' && <TripCreator />}
          {activeView === 'planner' && <TripPlanner />}
          {activeView === 'booking' && <BookingHub />}
          {activeView === 'navigation' && <NavigationMap />}
          {activeView === 'profile' && <UserProfile />}
        </main>
      </div>
    </TripProvider>
  );
}

export default App;