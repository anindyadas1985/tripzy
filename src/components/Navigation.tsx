import React from 'react';
import { Map, Calendar, Home, Bell, User, Plus, Receipt, Book, Mic, Plane } from 'lucide-react';
import { Header } from './layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { canAccessAdmin } from '../config/admin';

interface NavigationProps {
  activeView: 'dashboard' | 'create' | 'voice' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin';
  setActiveView: (view: 'dashboard' | 'create' | 'voice' | 'booking' | 'navigation' | 'expenses' | 'memories' | 'profile' | 'admin') => void;
}
