export const APP_CONFIG = {
  name: 'Journai',
  tagline: 'Plan. Book. Go.',
  version: '1.0.0',
  supportEmail: 'support@journai.com'
};

export const TRIP_STYLES = [
  { value: 'leisure', label: 'Leisure', description: 'Relaxed vacation' },
  { value: 'business', label: 'Business', description: 'Work & meetings' },
  { value: 'family', label: 'Family', description: 'Family-friendly' }
] as const;

export const TRIP_PACES = [
  { value: 'relaxed', label: 'Relaxed', description: 'Take it easy' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced schedule' },
  { value: 'packed', label: 'Packed', description: 'See everything' }
] as const;

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
] as const;

export const BUSINESS_TYPES = [
  { value: 'hotel', label: 'Hotel & Accommodation', icon: '🏨' },
  { value: 'airline', label: 'Airline & Aviation', icon: '✈️' },
  { value: 'transport', label: 'Transportation', icon: '🚗' },
  { value: 'activity', label: 'Tours & Activities', icon: '🎭' },
  { value: 'restaurant', label: 'Restaurant & Dining', icon: '🍽️' },
  { value: 'petrol_pump', label: 'Petrol Pump & Fuel Station', icon: '⛽' },
  { value: 'towing_service', label: 'Towing & Roadside Assistance', icon: '🚛' },
  { value: 'ev_charging', label: 'EV Charging Station', icon: '🔌' },
  { value: 'car_rental', label: 'Car Rental & Leasing', icon: '🚙' },
  { value: 'travel_insurance', label: 'Travel Insurance', icon: '🛡️' },
  { value: 'forex', label: 'Foreign Exchange', icon: '💱' },
  { value: 'taxi_service', label: 'Taxi & Cab Service', icon: '🚕' },
  { value: 'parking', label: 'Parking Services', icon: '🅿️' },
  { value: 'medical_service', label: 'Medical & Emergency Services', icon: '🏥' },
  { value: 'travel_agency', label: 'Travel Agency', icon: '🧳' }
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
] as const;