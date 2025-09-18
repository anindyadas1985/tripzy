import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { DatabaseStatus } from './components/DatabaseStatus';
import Navigation from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TripCreator } from './components/TripCreator';
import { TripPlanner } from './components/TripPlanner';
import { BookingHub } from './components/BookingHub';
import { NavigationMap } from './components/NavigationMap';
import { UserProfile } from './components/UserProfile';
import { ExpenseSharing } from './components/ExpenseSharing';
import { TripMemoryBook } from './components/TripMemoryBook';
import { VoiceTripPlanner } from './components/VoiceTripPlanner';
import { AdminConsole } from './components/AdminConsole';
import { TripProvider } from './contexts/TripContext';
import { canAccessAdmin } from './config/admin';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, vendor } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin'>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    console.log('AppContent mounted, isAuthenticated:', isAuthenticated);
    
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

  console.log('Rendering AppContent, activeView:', activeView);

  if (!isAuthenticated) {
    console.log('User not authenticated, showing AuthPage');
    return (
      <div>
        <DatabaseStatus onSetupComplete={() => setIsDatabaseReady(true)} />
        <AuthPage />
      </div>
    );
  }

  console.log('User authenticated, showing main app');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DatabaseStatus onSetupComplete={() => setIsDatabaseReady(true)} />
      
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
        {activeView === 'booking' && <BookingHub />}
        {activeView === 'navigation' && <NavigationMap />}
        {activeView === 'expenses' && <ExpenseSharing />}
        {activeView === 'memories' && <TripMemoryBook />}
        {activeView === 'profile' && <UserProfile />}
        {activeView === 'admin' && canAccessAdmin(user || vendor) && <AdminConsole />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  console.log('App component rendering');
  
  return (
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  );
};

export default App;