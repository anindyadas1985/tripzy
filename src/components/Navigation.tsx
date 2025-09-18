import React from 'react';
import { Map, Calendar, Home, Bell, User, Plus, Receipt, Book, Mic, Plane } from 'lucide-react';
import { Header } from './layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { canAccessAdmin } from '../config/admin';

interface NavigationProps {
  activeView: 'dashboard' | 'create' | 'voice' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin';
  setActiveView: (view: 'dashboard' | 'create' | 'voice' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { logout, user, vendor } = useAuth();
  const showAdmin = canAccessAdmin(user || vendor);
  
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'voice' as const, label: 'Speak & Go', icon: Mic },
    { id: 'create' as const, label: 'Create Trip', icon: Plus },
    { id: 'booking' as const, label: 'Book', icon: Plane },
    { id: 'navigation' as const, label: 'Navigate', icon: Map },
    { id: 'expenses' as const, label: 'Expenses', icon: Receipt },
    { id: 'memories' as const, label: 'Memories', icon: Book },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Sidebar Navigation */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <Header user={user} vendor={vendor} />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Notifications</span>
            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
              activeView === 'profile' 
                ? 'bg-sky-100 text-sky-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
          
          {showAdmin && (
            <button 
              onClick={() => setActiveView('admin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                activeView === 'admin' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">A</span>
              <span>Admin Console</span>
            </button>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
          >
            <span className="w-5 h-5 flex items-center justify-center">→</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
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
    </>
  );
};