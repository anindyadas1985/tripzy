import React from 'react';
import { Plane, Map, Calendar, Home, Bell, User, Plus, Receipt, Book, Mic } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { canAccessAdmin } from '../../config/admin';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { logout, user, vendor } = useAuth();
  const showAdmin = canAccessAdmin(user || vendor);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'voice', label: 'Speak & Go', icon: Mic },
    { id: 'create', label: 'Create Trip', icon: Plus },
    { id: 'booking', label: 'Book', icon: Plane },
    { id: 'navigation', label: 'Navigate', icon: Map },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'memories', label: 'Memories', icon: Book },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
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
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
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
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
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
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <span className="w-5 h-5 flex items-center justify-center text-sm">→</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};