import { Trip, Booking, TripUpdate } from '../types';

export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'European Adventure',
    destination: 'Paris, France',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-22'),
    status: 'upcoming',
    budget: 250000,
    spent: 85000,
    travelers: 2,
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
    itinerary: [
      {
        id: '1',
        type: 'flight',
        title: 'Flight to Paris',
        description: 'Direct flight from DEL to CDG',
        startTime: new Date('2025-03-15T08:00:00'),
        endTime: new Date('2025-03-15T14:30:00'),
        location: 'Charles de Gaulle Airport',
        cost: 45000,
        status: 'booked'
      },
      {
        id: '2',
        type: 'hotel',
        title: 'Hotel Le Marais',
        description: 'Boutique hotel in historic district',
        startTime: new Date('2025-03-15T15:00:00'),
        endTime: new Date('2025-03-22T11:00:00'),
        location: '4th Arrondissement, Paris',
        cost: 12000,
        status: 'booked'
      }
    ],
    origin: 'Delhi, India',
    style: 'leisure',
    pace: 'moderate',
    preferences: ['Cultural Sites', 'Food & Dining', 'Photography'],
    isShared: false
  },
  {
    id: '2',
    title: 'Tokyo Business Trip',
    destination: 'Tokyo, Japan',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-04-05'),
    status: 'upcoming',
    budget: 180000,
    spent: 55000,
    travelers: 1,
    image: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg',
    itinerary: [],
    origin: 'Mumbai, India',
    style: 'business',
    pace: 'packed',
    preferences: ['Business', 'Technology', 'Food & Dining'],
    isShared: false
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'book-1',
    tripId: '1',
    type: 'flight',
    title: 'DEL to CDG',
    provider: 'Air France',
    confirmationCode: 'AF1234567',
    date: new Date('2025-03-15'),
    cost: 45000,
    status: 'confirmed',
    details: {
      departure: 'DEL Terminal 3',
      arrival: 'CDG Terminal 2E',
      seat: '12A'
    }
  },
  {
    id: 'book-2',
    tripId: '1',
    type: 'hotel',
    title: 'Hotel Le Marais',
    provider: 'Booking.com',
    confirmationCode: 'BK9876543',
    date: new Date('2025-03-15'),
    cost: 75000,
    status: 'confirmed',
    details: {
      room: 'Superior Double Room',
      nights: 7,
      checkin: '15:00',
      checkout: '11:00'
    }
  }
];

export const mockUpdates: TripUpdate[] = [
  {
    id: 'upd-1',
    tripId: '1',
    type: 'weather',
    title: 'Weather Update',
    message: 'Clear skies expected in Paris for your arrival. Perfect weather for sightseeing!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    severity: 'low'
  },
  {
    id: 'upd-2',
    tripId: '1',
    type: 'recommendation',
    title: 'Local Recommendation',
    message: 'New highly-rated restaurant near your hotel: Le Comptoir du Relais. Would you like to make a reservation?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    severity: 'low',
    actionRequired: true
  }
];