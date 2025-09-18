import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { DatabaseStatus } from './components/DatabaseStatus';
import Navigation from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TripCreator } from './components/TripCreator';
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
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'voice' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin'>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  useEffect(() => {
    if (isAppInitialized) return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleNavigateToCreate = () => setActiveView('create');
    const handleNavigateToVoice = () => setActiveView('voice');
    const handleNavigateToBooking = () => setActiveView('booking');
    const handleNavigateToNavigation = () => setActiveView('navigation');
    const handleNavigateToExpenses = () => setActiveView('expenses');
    const handleNavigateToMemories = () => setActiveView('memories');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('navigate-to-create', handleNavigateToCreate);
    window.addEventListener('navigate-to-voice', handleNavigateToVoice);
    window.addEventListener('navigate-to-booking', handleNavigateToBooking);
    window.addEventListener('navigate-to-navigation', handleNavigateToNavigation);
    window.addEventListener('navigate-to-expenses', handleNavigateToExpenses);
    window.addEventListener('navigate-to-memories', handleNavigateToMemories);

    setIsAppInitialized(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('navigate-to-create', handleNavigateToCreate);
      window.removeEventListener('navigate-to-voice', handleNavigateToVoice);
      window.removeEventListener('navigate-to-booking', handleNavigateToBooking);
      window.removeEventListener('navigate-to-navigation', handleNavigateToNavigation);
      window.removeEventListener('navigate-to-expenses', handleNavigateToExpenses);
      window.removeEventListener('navigate-to-memories', handleNavigateToMemories);
    };
  }, [isAppInitialized]);

  if (!isAppInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading Journai...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <DatabaseStatus onSetupComplete={() => setIsDatabaseReady(true)} />
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DatabaseStatus onSetupComplete={() => setIsDatabaseReady(true)} />
      
      {!isOnline && (
        <div className="bg-orange-500 text-white text-center py-2 text-sm font-medium">
          You're offline. Some features may be limited.
        </div>
      )}
      
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className={`ml-64 ${!isOnline ? 'pt-4' : ''} md:ml-64 mobile:ml-0 mobile:pb-20`}>
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