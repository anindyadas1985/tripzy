import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, signIn, signUp, signOut, signInWithGoogle, handleOAuthCallback } from '../lib/supabase';
import { User, Vendor, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, userType: 'traveler' | 'vendor') => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
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

  useEffect(() => {
    console.log('AuthProvider mounted, authState:', authState);
    
    // Handle OAuth callback on page load
    const handleAuthCallback = async () => {
      try {
        const session = await handleOAuthCallback();
        if (session?.user) {
          const mockUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Google User',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone || '',
            userType: 'traveler',
            isVerified: true,
            createdAt: new Date(session.user.created_at)
          };
          
          setAuthState({
            isAuthenticated: true,
            user: mockUser,
            vendor: null
          });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
      }
    };
    
    handleAuthCallback();
  }, [authState]);

  const login = async (email: string, password: string, userType: 'traveler' | 'vendor'): Promise<boolean> => {
    console.log('Login attempt:', { email, userType });
    try {
      const { user } = await signIn(email, password);
      
      if (user) {
        // For demo purposes, we'll create mock user data
        // In production, this would come from the database
        if (userType === 'traveler') {
          const mockUser: User = {
            id: user.id,
            name: user.user_metadata?.name || 'Priya Sharma',
            email: user.email || email,
            phone: user.user_metadata?.phone || '+91 98765 43210',
            userType: 'traveler',
            isVerified: true,
            createdAt: new Date(user.created_at)
          };
          
          console.log('Setting traveler user:', mockUser);
          setAuthState({
            isAuthenticated: true,
            user: mockUser,
            vendor: null
          });
        } else {
          const mockVendor: Vendor = {
            id: user.id,
            businessName: user.user_metadata?.businessName || 'Royal Palace Hotel',
            ownerName: user.user_metadata?.ownerName || 'Rajesh Kumar',
            email: user.email || email,
            phone: user.user_metadata?.phone || '+91 98765 43210',
            businessType: user.user_metadata?.businessType || 'hotel',
            address: user.user_metadata?.address || '123 MG Road',
            city: user.user_metadata?.city || 'Mumbai',
            state: user.user_metadata?.state || 'Maharashtra',
            pincode: user.user_metadata?.pincode || '400001',
            gstNumber: user.user_metadata?.gstNumber || '27AABCU9603R1ZX',
            isVerified: true,
            rating: 4.5,
            totalBookings: 1250,
            createdAt: new Date(user.created_at)
          };
          
          console.log('Setting vendor user:', mockVendor);
          setAuthState({
            isAuthenticated: true,
            user: null,
            vendor: mockVendor
          });
        }
        
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to demo mode for development
    }
    
    // Demo mode fallback
    console.log('Using demo mode fallback');
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
        businessType: 'hotel' as any,
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
    try {
      const { user } = await signUp(userData.email, 'defaultPassword123', {
        name: userData.name,
        phone: userData.phone,
        userType: userData.userType
      });
      
      if (user) {
        const newUser: User = {
          ...userData,
          id: user.id,
          isVerified: false,
          createdAt: new Date(user.created_at)
        };
        
        setAuthState({
          isAuthenticated: true,
          user: newUser,
          vendor: null
        });
        
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback to demo mode
    }
    
    // Demo mode fallback
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
    try {
      const { user } = await signUp(vendorData.email, 'defaultPassword123', {
        businessName: vendorData.businessName,
        ownerName: vendorData.ownerName,
        phone: vendorData.phone,
        businessType: vendorData.businessType,
        address: vendorData.address,
        city: vendorData.city,
        state: vendorData.state,
        pincode: vendorData.pincode,
        gstNumber: vendorData.gstNumber
      });
      
      if (user) {
        const newVendor: Vendor = {
          ...vendorData,
          id: user.id,
          isVerified: false,
          rating: 0,
          totalBookings: 0,
          createdAt: new Date(user.created_at)
        };
        
        setAuthState({
          isAuthenticated: true,
          user: null,
          vendor: newVendor
        });
        
        return true;
      }
    } catch (error) {
      console.error('Vendor registration error:', error);
      // Fallback to demo mode
    }
    
    // Demo mode fallback
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
    signOut().catch(console.error);
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
      loginWithGoogle,
      registerUser,
      registerVendor,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};