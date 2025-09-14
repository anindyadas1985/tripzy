import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
}

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  stats: AdminStats;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshStats: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    systemHealth: 'healthy'
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would validate against admin database
    if (email === 'admin@journai.com' && password === 'admin123') {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@journai.com',
        name: 'System Administrator',
        role: 'super_admin',
        permissions: ['all'],
        lastLogin: new Date()
      };
      
      setAdminUser(mockAdmin);
      setIsAuthenticated(true);
      refreshStats();
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const refreshStats = () => {
    // Mock stats - in production, this would fetch from database
    setStats({
      totalUsers: 12547,
      totalVendors: 1834,
      totalTrips: 8923,
      totalBookings: 15672,
      totalRevenue: 2847593,
      activeUsers: 1247,
      systemHealth: 'healthy'
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(refreshStats, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      adminUser,
      stats,
      login,
      logout,
      refreshStats
    }}>
      {children}
    </AdminContext.Provider>
  );
};