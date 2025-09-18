import React from 'react';
import { Sidebar } from './navigation/Sidebar';
import { MobileNav } from './navigation/MobileNav';

interface NavigationProps {
  activeView: 'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin';
  setActiveView: (view: 'dashboard' | 'create' | 'voice' | 'planner' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <>
      <div className="hidden md:block">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>
      <div className="md:hidden">
        <MobileNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </>
  );
};

export default Navigation;