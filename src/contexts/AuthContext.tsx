import React, { createContext, useContext, useState } from 'react';
import { User, Vendor, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, userType: 'traveler' | 'vendor') => Promise<boolean>;
  registerUser: (userData: Omit<User, 'id' | 'isVerified' | 'createdAt'>) => Promise<boolean>;
  registerVendor: (vendorData: Omit<Vendor, 'id' | 'isVerified' | 'rating' | 'totalBookings' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    vendor: null
  });

  const login = async (email: string, password: string, userType: 'traveler' | 'vendor'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userType === 'traveler') {
      const mockUser: User = {
        id: '1',
        name: 'Priya Sharma',
        email: email,
        phone: '+91 98765 43210',
        userType: 'traveler',
        isVerified: true,
        createdAt: new Date()
      };
      
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        vendor: null
      });
    } else {
      const mockVendor: Vendor = {
        id: '1',
        businessName: 'Royal Palace Hotel',
        ownerName: 'Rajesh Kumar',
        email: email,
        phone: '+91 98765 43210',
        businessType: 'hotel',
        address: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        gstNumber: '27AABCU9603R1ZX',
        isVerified: true,
        rating: 4.5,
        totalBookings: 1250,
        createdAt: new Date()
      };
      
      setAuthState({
        isAuthenticated: true,
        user: null,
        vendor: mockVendor
      });
    }
    
    return true;
  };

  const registerUser = async (userData: Omit<User, 'id' | 'isVerified' | 'createdAt'>): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      isVerified: false,
      createdAt: new Date()
    };
    
    setAuthState({
      isAuthenticated: true,
      user: newUser,
      vendor: null
    });
    
    return true;
  };

  const registerVendor = async (vendorData: Omit<Vendor, 'id' | 'isVerified' | 'rating' | 'totalBookings' | 'createdAt'>): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newVendor: Vendor = {
      ...vendorData,
      id: Date.now().toString(),
      isVerified: false,
      rating: 0,
      totalBookings: 0,
      createdAt: new Date()
    };
    
    setAuthState({
      isAuthenticated: true,
      user: null,
      vendor: newVendor
    });
    
    return true;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      vendor: null
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      registerUser,
      registerVendor,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};