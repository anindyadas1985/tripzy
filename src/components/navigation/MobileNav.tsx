import React from 'react';
import { Home, Plus, Plane, Map, Receipt, Mic } from 'lucide-react';

interface MobileNavProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'booking', label: 'Book', icon: Plane },
    { id: 'expenses', label: 'Split', icon: Receipt }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
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
  );
};