import React from 'react';
import { 
  Shield, BarChart3, Users, Building2, MapPin, Calendar, 
  Activity, Settings, FileText, LogOut, Bell 
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface AdminNavigationProps {
  activeView: 'dashboard' | 'users' | 'vendors' | 'trips' | 'bookings' | 'analytics' | 'monitoring' | 'settings' | 'audit';
  setActiveView: (view: 'dashboard' | 'users' | 'vendors' | 'trips' | 'bookings' | 'analytics' | 'monitoring' | 'settings' | 'audit') => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ activeView, setActiveView }) => {
  const { logout, adminUser } = useAdmin();
  
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'vendors' as const, label: 'Vendors', icon: Building2 },
    { id: 'trips' as const, label: 'Trips', icon: MapPin },
    { id: 'bookings' as const, label: 'Bookings', icon: Calendar },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'monitoring' as const, label: 'Monitoring', icon: Activity },
    { id: 'audit' as const, label: 'Audit Logs', icon: FileText },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                Admin Console
              </span>
              <div className="text-xs text-gray-400 -mt-1">
                {adminUser ? `${adminUser.name} (${adminUser.role})` : 'Journai Travel Platform'}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button className="relative p-2.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-700 bg-slate-900">
        <div className="flex items-center justify-around py-2 overflow-x-auto">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeView === item.id
                    ? 'text-amber-400 bg-slate-800'
                    : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};