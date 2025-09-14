import React, { useState, useEffect } from 'react';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminNavigation } from './components/AdminNavigation';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/UserManagement';
import { VendorManagement } from './components/VendorManagement';
import { TripManagement } from './components/TripManagement';
import { BookingManagement } from './components/BookingManagement';
import { Analytics } from './components/Analytics';
import { SystemMonitoring } from './components/SystemMonitoring';
import { Settings } from './components/Settings';
import { AuditLogs } from './components/AuditLogs';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAdmin();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'vendors' | 'trips' | 'bookings' | 'analytics' | 'monitoring' | 'settings' | 'audit'>('dashboard');
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

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {!isOnline && (
        <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
          You're offline. Some features may be limited.
        </div>
      )}
      
      <AdminNavigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className={`${!isOnline ? 'pt-20' : 'pt-16'}`}>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'users' && <UserManagement />}
        {activeView === 'vendors' && <VendorManagement />}
        {activeView === 'trips' && <TripManagement />}
        {activeView === 'bookings' && <BookingManagement />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'monitoring' && <SystemMonitoring />}
        {activeView === 'settings' && <Settings />}
        {activeView === 'audit' && <AuditLogs />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
};

export default App;