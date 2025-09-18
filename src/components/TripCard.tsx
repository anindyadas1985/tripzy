import React from 'react';
import { TripCard as BaseTripCard } from './cards/TripCard';
import { Trip } from '../types';
import { useTripContext } from '../contexts/TripContext';

interface TripCardProps {
  trip: Trip;
  featured?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, featured = false }) => {
  const { setActiveTrip } = useTripContext();

  return (
    <BaseTripCard
      trip={trip}
      featured={featured}
      onClick={() => setActiveTrip(trip)}
    />
  );
};