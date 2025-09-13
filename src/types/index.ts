export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  itinerary: ItineraryItem[];
  budget: number;
  spent: number;
  travelers: number;
  image: string;
}

export interface ItineraryItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'transport';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  cost: number;
  bookingId?: string;
  status: 'booked' | 'pending' | 'cancelled';
}

export interface Booking {
  id: string;
  tripId: string;
  type: 'flight' | 'hotel' | 'car' | 'activity';
  title: string;
  provider: string;
  confirmationCode: string;
  date: Date;
  cost: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  details: any;
}

export interface TripUpdate {
  id: string;
  tripId: string;
  type: 'delay' | 'cancellation' | 'weather' | 'traffic' | 'recommendation';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

export interface SearchFilters {
  destination: string;
  dates: {
    start: Date;
    end: Date;
  };
  travelers: number;
  budget?: {
    min: number;
    max: number;
  };
  preferences: string[];
}