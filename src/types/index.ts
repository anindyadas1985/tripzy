export interface Trip {
  id: string;
  title: string;
  origin: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  style: 'leisure' | 'business' | 'family';
  budget: number;
  spent: number;
  pace: 'relaxed' | 'moderate' | 'packed';
  travelers: number;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
  itinerary: ItineraryItem[];
  image: string;
  preferences: string[];
  shareCode?: string;
  isShared: boolean;
}

export interface ItineraryItem {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'hotel' | 'activity' | 'transport' | 'meal' | 'break';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  cost: number;
  bookingId?: string;
  status: 'suggested' | 'booked' | 'confirmed' | 'cancelled';
  provider?: string;
  confirmationCode?: string;
  category?: string;
  rating?: number;
  duration?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  tripId: string;
  type: 'flight' | 'train' | 'bus' | 'hotel' | 'car' | 'activity';
  title: string;
  provider: string;
  confirmationCode: string;
  date: Date;
  cost: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  details: any;
  paymentMethod?: string;
  receipt?: string;
  cancellationPolicy?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface TripUpdate {
  id: string;
  tripId: string;
  type: 'delay' | 'cancellation' | 'weather' | 'traffic' | 'recommendation' | 'gate_change' | 'price_drop';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: boolean;
  suggestedAction?: string;
  alternativeOptions?: any[];
}

export interface SearchFilters {
  origin: string;
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
  style: 'leisure' | 'business' | 'family';
  pace: 'relaxed' | 'moderate' | 'packed';
  preferences: string[];
}

export interface TransportOption {
  id: string;
  type: 'flight' | 'train' | 'bus';
  provider: string;
  departure: {
    time: string;
    location: string;
    terminal?: string;
  };
  arrival: {
    time: string;
    location: string;
    terminal?: string;
  };
  duration: string;
  price: number;
  originalPrice?: number;
  stops: number;
  amenities: string[];
  cancellationPolicy: string;
  baggage?: string;
  seatSelection?: boolean;
  refundable: boolean;
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  distance: string;
  reviews: number;
  roomType: string;
  cancellationPolicy: string;
  breakfast: boolean;
  wifi: boolean;
  parking: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
    newsletter: boolean;
  };
  loyaltyPrograms: LoyaltyProgram[];
  paymentMethods: PaymentMethod[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface LoyaltyProgram {
  id: string;
  provider: string;
  membershipNumber: string;
  tier: string;
  points: number;
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface NavigationRoute {
  id: string;
  from: string;
  to: string;
  mode: 'walking' | 'driving' | 'transit' | 'cycling';
  distance: string;
  duration: string;
  steps: RouteStep[];
  trafficCondition: 'light' | 'moderate' | 'heavy';
  alternativeRoutes?: NavigationRoute[];
}

export interface RouteStep {
  id: string;
  instruction: string;
  distance: string;
  duration: string;
  type: 'straight' | 'left' | 'right' | 'continue' | 'merge' | 'exit';
  streetName?: string;
  transitInfo?: {
    line: string;
    direction: string;
    stops: number;
  };
}

export interface Receipt {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  date: Date;
  items: ReceiptItem[];
  taxes: number;
  fees: number;
  paymentMethod: string;
  downloadUrl?: string;
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}