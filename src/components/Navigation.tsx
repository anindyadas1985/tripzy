import React from 'react';
import { Plane, Map, Calendar, Home, Bell, User, Plus, Receipt, Book, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  activeView: 'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile';
  setActiveView: (view: 'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { logout, user, vendor } = useAuth();
  
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'voice' as const, label: 'Speak & Go', icon: Mic },
    { id: 'create' as const, label: 'Create Trip', icon: Plus },
    { id: 'planner' as const, label: 'Plan', icon: Calendar },
    { id: 'booking' as const, label: 'Book', icon: Plane },
    { id: 'navigation' as const, label: 'Navigate', icon: Map },
    { id: 'expenses' as const, label: 'Expenses', icon: Receipt },
    { id: 'memories' as const, label: 'Memories', icon: Book },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Journai
              </span>
              <div className="text-xs text-gray-500 -mt-1">
                {user ? `Welcome, ${user.name}` : vendor ? `${vendor.businessName}` : 'Plan. Book. Go.'}
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
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              onClick={() => setActiveView('profile')}
              className={`p-2.5 rounded-xl transition-colors ${
                activeView === 'profile' 
                  ? 'bg-sky-100 text-sky-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Logout"
            >
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeView === item.id
                    ? 'text-sky-700 bg-sky-50'
                    : 'text-gray-600'
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