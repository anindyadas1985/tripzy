import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
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
import { AIAgentProvider } from './contexts/AIAgentContext';
import { AIAssistant } from './components/AIAssistant';
import { canAccessAdmin } from './config/admin';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, vendor } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin'>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('AppContent mounted, isAuthenticated:', isAuthenticated);
    }
    
    const handleOnline = () => {
      try {
        setIsOnline(true);
      } catch (error) {
        console.error('Error setting online status:', error);
      }
    };
    
    const handleOffline = () => {
      try {
        setIsOnline(false);
      } catch (error) {
        console.error('Error setting offline status:', error);
      }
    };
    
    const handleNavigateToCreate = () => {
      try {
        setActiveView('create');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };
    
    const handleNavigateToVoice = () => {
      try {
        setActiveView('voice');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };
    
    const handleNavigateToBooking = () => {
      try {
        setActiveView('booking');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };
    
    const handleNavigateToNavigation = () => {
      try {
        setActiveView('navigation');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };
    
    const handleNavigateToExpenses = () => {
      try {
        setActiveView('expenses');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };
    
    const handleNavigateToMemories = () => {
      try {
        setActiveView('memories');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };
    
    const handleNavigateToDashboard = () => {
      try {
        setActiveView('dashboard');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('navigate-to-create', handleNavigateToCreate);
    window.addEventListener('navigate-to-voice', handleNavigateToVoice);
    window.addEventListener('navigate-to-booking', handleNavigateToBooking);
    window.addEventListener('navigate-to-navigation', handleNavigateToNavigation);
    window.addEventListener('navigate-to-expenses', handleNavigateToExpenses);
    window.addEventListener('navigate-to-memories', handleNavigateToMemories);
    window.addEventListener('navigate-to-dashboard', handleNavigateToDashboard);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('navigate-to-create', handleNavigateToCreate);
      window.removeEventListener('navigate-to-voice', handleNavigateToVoice);
      window.removeEventListener('navigate-to-booking', handleNavigateToBooking);
      window.removeEventListener('navigate-to-navigation', handleNavigateToNavigation);
      window.removeEventListener('navigate-to-expenses', handleNavigateToExpenses);
      window.removeEventListener('navigate-to-memories', handleNavigateToMemories);
      window.removeEventListener('navigate-to-dashboard', handleNavigateToDashboard);
    };
  }, []);

  if (import.meta.env.DEV) {
    console.log('Rendering AppContent, activeView:', activeView);
  }

  if (!isAuthenticated) {
    if (import.meta.env.DEV) {
      console.log('User not authenticated, showing AuthPage');
    }
    return (
      <div>
        <DatabaseStatus onSetupComplete={() => setIsDatabaseReady(true)} />
        <AuthPage />
      </div>
    );
  }

  if (import.meta.env.DEV) {
    console.log('User authenticated, showing main app');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <DatabaseStatus onSetupComplete={() => setIsDatabaseReady(true)} />

      {!isOnline && (
        <div className="bg-orange-500 text-white text-center py-2 text-sm font-medium fixed top-0 left-0 right-0 z-50">
          You're offline. Some features may be limited.
        </div>
      )}

      <Navigation activeView={activeView} setActiveView={setActiveView} />

      <main className={`flex-1 md:ml-64 ${!isOnline ? 'pt-10' : ''} pb-20 md:pb-0`}>
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

      <AIAssistant />
    </div>
  );
};

const App: React.FC = () => {
  if (import.meta.env.DEV) {
    console.log('App component rendering');
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AIAgentProvider>
          <TripProvider>
            <AppContent />
          </TripProvider>
        </AIAgentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;