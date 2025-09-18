import React from 'react';
import { Plane } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  user?: { name: string } | null;
  vendor?: { businessName: string } | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Journai", 
  subtitle = "Plan. Book. Go.",
  user,
  vendor 
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
        <Plane className="w-6 h-6 text-white" />
      </div>
      <div>
        <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </span>
        <div className="text-xs text-gray-500 -mt-1">
          {user ? `Welcome, ${user.name}` : vendor ? `${vendor.businessName}` : subtitle}
        </div>
      </div>
    </div>
  );
};