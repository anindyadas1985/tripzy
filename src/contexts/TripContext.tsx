import React, { createContext, useContext, useState } from 'react';
import { Trip, Booking, TripUpdate, UserProfile } from '../types';

interface TripContextType {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  updates: TripUpdate[];
  setUpdates: React.Dispatch<React.SetStateAction<TripUpdate[]>>;
  activeTrip: Trip | null;
  setActiveTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  createTrip: (tripData: Partial<Trip>) => Trip;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  shareTrip: (tripId: string) => string;
}

export const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripContext.Provider');
  }
  return context;
};

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [updates, setUpdates] = useState<TripUpdate[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const createTrip = (tripData: Partial<Trip>): Trip => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      title: tripData.title || 'New Trip',
      origin: tripData.origin || '',
      destination: tripData.destination || '',
      startDate: tripData.startDate || new Date(),
      endDate: tripData.endDate || new Date(),
      style: tripData.style || 'leisure',
      budget: tripData.budget || 0,
      spent: 0,
      pace: tripData.pace || 'moderate',
      travelers: tripData.travelers || 1,
      status: 'planning',
      itinerary: [],
      image: tripData.image || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      preferences: tripData.preferences || [],
      isShared: false
    };

    setTrips(prev => [...prev, newTrip]);
    return newTrip;
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
    setBookings(prev => prev.filter(booking => booking.tripId !== tripId));
    setUpdates(prev => prev.filter(update => update.tripId !== tripId));
  };

  const shareTrip = (tripId: string): string => {
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    updateTrip(tripId, { shareCode, isShared: true });
    return shareCode;
  };

  const value = {
    trips,
    setTrips,
    bookings,
    setBookings,
    updates,
    setUpdates,
    activeTrip,
    setActiveTrip,
    userProfile,
    setUserProfile,
    isOffline,
    setIsOffline,
    createTrip,
    updateTrip,
    deleteTrip,
    shareTrip
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};