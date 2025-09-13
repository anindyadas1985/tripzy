import React, { createContext, useContext } from 'react';
import { Trip, Booking, TripUpdate } from '../types';

interface TripContextType {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  updates: TripUpdate[];
  setUpdates: React.Dispatch<React.SetStateAction<TripUpdate[]>>;
  activeTrip: Trip | null;
  setActiveTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
}

export const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripContext.Provider');
  }
  return context;
};