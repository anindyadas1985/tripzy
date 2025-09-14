import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TripCreator } from './components/TripCreator';
import { TripPlanner } from './components/TripPlanner';
import { BookingHub } from './components/BookingHub';
import { NavigationMap } from './components/NavigationMap';
import { UserProfile } from './components/UserProfile';
import { ExpenseSharing } from './components/ExpenseSharing';
import { TripMemoryBook } from './components/TripMemoryBook';
import { VoiceTripPlanner } from './components/VoiceTripPlanner';
import { TripProvider } from './contexts/TripContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile'>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleNavigateToCreate = () => setActiveView('create');
    const handleNavigateToPlanner = () => setActiveView('planner');
    const handleNavigateToVoice = () => setActiveView('voice');
    const handleNavigateToBooking = () => setActiveView('booking');
    const handleNavigateToNavigation = () => setActiveView('navigation');
    const handleNavigateToExpenses = () => setActiveView('expenses');
    const handleNavigateToMemories = () => setActiveView('memories');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('navigate-to-create', handleNavigateToCreate);
    window.addEventListener('navigate-to-planner', handleNavigateToPlanner);
    window.addEventListener('navigate-to-voice', handleNavigateToVoice);
    window.addEventListener('navigate-to-booking', handleNavigateToBooking);
    window.addEventListener('navigate-to-navigation', handleNavigateToNavigation);
    window.addEventListener('navigate-to-expenses', handleNavigateToExpenses);
    window.addEventListener('navigate-to-memories', handleNavigateToMemories);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('navigate-to-create', handleNavigateToCreate);
      window.removeEventListener('navigate-to-planner', handleNavigateToPlanner);
      window.removeEventListener('navigate-to-voice', handleNavigateToVoice);
      window.removeEventListener('navigate-to-booking', handleNavigateToBooking);
      window.removeEventListener('navigate-to-navigation', handleNavigateToNavigation);
      window.removeEventListener('navigate-to-expenses', handleNavigateToExpenses);
      window.removeEventListener('navigate-to-memories', handleNavigateToMemories);
    };
  }, []);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
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
        {activeView === 'voice' && <VoiceTripPlanner />}
        {activeView === 'planner' && <TripPlanner />}
        {activeView === 'booking' && <BookingHub />}
        {activeView === 'navigation' && <NavigationMap />}
        {activeView === 'expenses' && <ExpenseSharing />}
        {activeView === 'memories' && <TripMemoryBook />}
        {activeView === 'profile' && <UserProfile />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  );
}

export default App;