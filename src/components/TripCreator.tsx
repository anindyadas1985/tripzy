import React, { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Zap, Clock, Heart, Briefcase, Baby, Plane, Building, Star, Check, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface AIPackage {
  id: string;
  title: string;
  totalCost: number;
  savings: number;
  flight: {
    id: string;
    airline: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    price: number;
    duration: string;
  };
  hotel: {
    id: string;
    name: string;
    rating: number;
    price: number;
    nights: number;
    amenities: string[];
  };
  activities: Array<{
    name: string;
    price: number;
    duration: string;
  }>;
  itinerary: Array<{
    day: number;
    activities: string[];
  }>;
}

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departure: { time: string; airport: string; city: string };
  arrival: { time: string; airport: string; city: string };
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
}

interface HotelOption {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  distance: string;
  reviews: number;
}

export const TripCreator: React.FC = () => {
  const { createTrip, setActiveTrip } = useTripContext();
  
  // Check for voice data from sessionStorage
  const getInitialFormData = () => {
    const voiceData = sessionStorage.getItem('voiceTripData');
    if (voiceData) {
      try {
        const parsed = JSON.parse(voiceData);
        // Clear the data after using it
        sessionStorage.removeItem('voiceTripData');
        return {
          title: parsed.title || '',
          origin: parsed.origin || '',
          destination: parsed.destination || '',
          startDate: parsed.startDate ? new Date(parsed.startDate).toISOString().split('T')[0] : '',
          endDate: parsed.endDate ? new Date(parsed.endDate).toISOString().split('T')[0] : '',
          travelers: parsed.travelers || 1,
          budget: parsed.budget || '',
          style: parsed.style || 'leisure',
          pace: parsed.pace || 'moderate',
          preferences: parsed.preferences || [],
          specialRequirements: parsed.specialRequirements || ''
        };
      } catch (error) {
        console.error('Error parsing voice data:', error);
      }
    }
    return {
      title: '',
      origin: '',
      destination: '',
      startDate: '',
      endDate: '',
      travelers: 1,
      budget: '',
      style: 'leisure' as 'leisure' | 'business' | 'family',
      pace: 'moderate' as 'relaxed' | 'moderate' | 'packed',
      preferences: [] as string[],
      specialRequirements: ''
    };
  };
  
  const [formData, setFormData] = useState(getInitialFormData());
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);
  const [aiPackages, setAiPackages] = useState<AIPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<AIPackage | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizationStep, setCustomizationStep] = useState<'flight' | 'hotel' | 'summary'>('flight');
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  
  // Show voice data indicator if available
  const [hasVoiceData] = useState(() => {
    return sessionStorage.getItem('voiceTripData') !== null;
  });

  const styleOptions = [
    {
      id: 'leisure' as const,
      title: 'Leisure',
      description: 'Relaxation, sightseeing, and personal enjoyment',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'business' as const,
      title: 'Business',
      description: 'Meetings, conferences, and professional travel',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'family' as const,
      title: 'Family',
      description: 'Kid-friendly activities and family bonding',
      icon: Baby,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const paceOptions = [
    {
      id: 'relaxed' as const,
      title: 'Relaxed',
      description: '2-3 activities per day, plenty of downtime',
      icon: '🌅'
    },
    {
      id: 'moderate' as const,
      title: 'Moderate',
      description: '4-5 activities per day, balanced schedule',
      icon: '⚖️'
    },
    {
      id: 'packed' as const,
      title: 'Packed',
      description: '6+ activities per day, maximize experiences',
      icon: '⚡'
    }
  ];

  const preferenceOptions = [
    'Cultural Sites', 'Museums', 'Food & Dining', 'Adventure Sports', 
    'Relaxation & Spa', 'Photography', 'Shopping', 'Nightlife', 
    'Nature & Parks', 'History', 'Art Galleries', 'Local Markets',
    'Architecture', 'Music & Entertainment', 'Beaches', 'Mountains'
  ];

  // Mock flight options for customization
  const mockFlightOptions: FlightOption[] = [
    {
      id: '1',
      airline: 'Air France',
      flightNumber: 'AF 007',
      departure: { time: '08:00', airport: 'JFK', city: 'New York' },
      arrival: { time: '21:30', airport: 'CDG', city: 'Paris' },
      duration: '7h 30m',
      price: 650,
      stops: 0,
      aircraft: 'Boeing 777'
    },
    {
      id: '2',
      airline: 'Delta',
      flightNumber: 'DL 264',
      departure: { time: '10:15', airport: 'JFK', city: 'New York' },
      arrival: { time: '23:45', airport: 'CDG', city: 'Paris' },
      duration: '7h 30m',
      price: 620,
      stops: 0,
      aircraft: 'Airbus A330'
    },
    {
      id: '3',
      airline: 'Lufthansa',
      flightNumber: 'LH 441',
      departure: { time: '14:20', airport: 'JFK', city: 'New York' },
      arrival: { time: '09:15+1', airport: 'CDG', city: 'Paris' },
      duration: '9h 55m',
      price: 580,
      stops: 1,
      aircraft: 'Airbus A340'
    }
  ];

  // Mock hotel options for customization
  const mockHotelOptions: HotelOption[] = [
    {
      id: '1',
      name: 'Le Marais Boutique Hotel',
      location: '4th Arrondissement, Paris',
      rating: 4.8,
      price: 180,
      originalPrice: 220,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      amenities: ['Free WiFi', 'Breakfast', 'Room Service', 'Spa'],
      distance: '0.2 km from city center',
      reviews: 1247
    },
    {
      id: '2',
      name: 'Grand Hotel Saint-Germain',
      location: '6th Arrondissement, Paris',
      rating: 4.6,
      price: 250,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      amenities: ['Free WiFi', 'Parking', 'Spa', 'Restaurant'],
      distance: '0.5 km from city center',
      reviews: 892
    },
    {
      id: '3',
      name: 'Hotel des Arts Montmartre',
      location: '18th Arrondissement, Paris',
      rating: 4.4,
      price: 140,
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
      amenities: ['Free WiFi', 'Breakfast', 'Concierge'],
      distance: '1.2 km from city center',
      reviews: 654
    }
  ];

  const togglePreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const generateAIPackages = async () => {
    if (!formData.origin || !formData.destination || !formData.budget) {
      alert('Please fill in origin, destination, and budget to generate packages');
      return;
    }

    setIsGeneratingPackage(true);
    
    // Simulate AI package generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const budget = parseInt(formData.budget);
    const nights = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24));
    
    const mockPackages: AIPackage[] = [
      {
        id: '1',
        title: 'Premium Experience',
        totalCost: Math.round(budget * 0.95),
        savings: Math.round(budget * 0.15),
        flight: {
          id: '1',
          airline: 'Air France',
          flightNumber: 'AF 007',
          departure: '08:00 AM',
          arrival: '09:30 PM',
          price: Math.round(budget * 0.4),
          duration: '7h 30m'
        },
        hotel: {
          id: '1',
          name: 'Le Marais Boutique Hotel',
          rating: 4.8,
          price: Math.round(budget * 0.35 / nights),
          nights: nights,
          amenities: ['Free WiFi', 'Breakfast', 'Spa', 'Room Service']
        },
        activities: [
          { name: 'Eiffel Tower Skip-the-Line', price: 45, duration: '2 hours' },
          { name: 'Louvre Museum Tour', price: 65, duration: '3 hours' },
          { name: 'Seine River Cruise', price: 35, duration: '1.5 hours' }
        ],
        itinerary: [
          { day: 1, activities: ['Airport Transfer', 'Hotel Check-in', 'Welcome Dinner'] },
          { day: 2, activities: ['Eiffel Tower', 'Seine River Cruise', 'Local Restaurant'] },
          { day: 3, activities: ['Louvre Museum', 'Shopping', 'Cultural Show'] }
        ]
      },
      {
        id: '2',
        title: 'Balanced Explorer',
        totalCost: Math.round(budget * 0.85),
        savings: Math.round(budget * 0.25),
        flight: {
          id: '2',
          airline: 'Delta Airlines',
          flightNumber: 'DL 264',
          departure: '10:15 AM',
          arrival: '11:45 PM',
          price: Math.round(budget * 0.35),
          duration: '7h 30m'
        },
        hotel: {
          id: '2',
          name: 'Hotel des Arts Montmartre',
          rating: 4.4,
          price: Math.round(budget * 0.3 / nights),
          nights: nights,
          amenities: ['Free WiFi', 'Breakfast', 'Concierge']
        },
        activities: [
          { name: 'City Walking Tour', price: 25, duration: '3 hours' },
          { name: 'Museum Pass', price: 55, duration: 'Full day' },
          { name: 'Food Market Tour', price: 40, duration: '2 hours' }
        ],
        itinerary: [
          { day: 1, activities: ['Arrival', 'City Orientation', 'Local Dinner'] },
          { day: 2, activities: ['Walking Tour', 'Museum Visit', 'Café Culture'] },
          { day: 3, activities: ['Food Markets', 'Shopping', 'Farewell Dinner'] }
        ]
      },
      {
        id: '3',
        title: 'Budget Friendly',
        totalCost: Math.round(budget * 0.75),
        savings: Math.round(budget * 0.35),
        flight: {
          id: '3',
          airline: 'Lufthansa',
          flightNumber: 'LH 441',
          departure: '02:20 PM',
          arrival: '09:15 AM+1',
          price: Math.round(budget * 0.3),
          duration: '9h 55m (1 stop)'
        },
        hotel: {
          id: '3',
          name: 'Comfort Inn Central',
          rating: 4.0,
          price: Math.round(budget * 0.25 / nights),
          nights: nights,
          amenities: ['Free WiFi', 'Breakfast']
        },
        activities: [
          { name: 'Free Walking Tour', price: 0, duration: '2 hours' },
          { name: 'Public Museum Entry', price: 15, duration: '2 hours' },
          { name: 'Local Market Visit', price: 0, duration: '1 hour' }
        ],
        itinerary: [
          { day: 1, activities: ['Arrival', 'Free City Walk', 'Budget Dinner'] },
          { day: 2, activities: ['Museum Visit', 'Park Stroll', 'Local Eatery'] },
          { day: 3, activities: ['Market Visit', 'Last-minute Shopping', 'Departure'] }
        ]
      }
    ];
    
    setAiPackages(mockPackages);
    setIsGeneratingPackage(false);
    setCurrentStep(2);
  };

  const handlePackageSelection = (packageData: AIPackage) => {
    setSelectedPackage(packageData);
    // Set initial selections based on package
    const initialFlight = mockFlightOptions.find(f => f.id === packageData.flight.id) || mockFlightOptions[0];
    const initialHotel = mockHotelOptions.find(h => h.id === packageData.hotel.id) || mockHotelOptions[0];
    setSelectedFlight(initialFlight);
    setSelectedHotel(initialHotel);
    setCurrentStep(3);
  };

  const handleCustomizePackage = () => {
    setIsCustomizing(true);
    setCustomizationStep('flight');
  };

  const handleFlightSelect = (flight: FlightOption) => {
    setSelectedFlight(flight);
    setCustomizationStep('hotel');
  };

  const handleHotelSelect = (hotel: HotelOption) => {
    setSelectedHotel(hotel);
    setCustomizationStep('summary');
  };

  const calculateCustomizedCost = () => {
    if (!selectedFlight || !selectedHotel || !selectedPackage) return 0;
    
    const flightCost = selectedFlight.price;
    const hotelCost = selectedHotel.price * selectedPackage.hotel.nights;
    const activitiesCost = selectedPackage.activities.reduce((sum, activity) => sum + activity.price, 0);
    
    return flightCost + hotelCost + activitiesCost;
  };

  const handleBookPackage = async () => {
    if (!selectedPackage || !selectedFlight || !selectedHotel) return;
    
    setIsBooking(true);
    
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create bookings for flight and hotel
      const flightBooking = {
        id: Date.now().toString(),
        tripId: 'current-trip',
        type: 'flight' as const,
        title: `${formData.origin} to ${formData.destination}`,
        provider: selectedFlight.airline,
        confirmationCode: `FL${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(formData.startDate),
        cost: selectedFlight.price,
        status: 'confirmed' as const,
        details: {
          departure: selectedFlight.departure.time,
          arrival: selectedFlight.arrival.time,
          duration: selectedFlight.duration,
          flightNumber: selectedFlight.flightNumber
        }
      };

      const hotelBooking = {
        id: (Date.now() + 1).toString(),
        tripId: 'current-trip',
        type: 'hotel' as const,
        title: selectedHotel.name,
        provider: 'Booking.com',
        confirmationCode: `HT${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(formData.startDate),
        cost: selectedHotel.price * selectedPackage.hotel.nights,
        status: 'confirmed' as const,
        details: {
          rating: selectedHotel.rating,
          nights: selectedPackage.hotel.nights,
          amenities: selectedHotel.amenities.join(', '),
          checkIn: formData.startDate,
          checkOut: formData.endDate
        }
      };

      // Store bookings
      const existingBookings = JSON.parse(localStorage.getItem('journai_bookings') || '[]');
      existingBookings.push(flightBooking, hotelBooking);
      localStorage.setItem('journai_bookings', JSON.stringify(existingBookings));

      // Create trip
      const newTrip = createTrip({
        title: formData.title || `${formData.origin} to ${formData.destination}`,
        origin: formData.origin,
        destination: formData.destination,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        travelers: formData.travelers,
        budget: parseInt(formData.budget) || 0,
        style: formData.style,
        pace: formData.pace,
        preferences: formData.preferences,
        specialRequirements: formData.specialRequirements
      });

      setActiveTrip(newTrip);
      
      const totalCost = isCustomizing ? calculateCustomizedCost() : selectedPackage.totalCost;
      
      alert(`🎉 Trip booked successfully!\n\nFlight: ${flightBooking.confirmationCode}\nHotel: ${hotelBooking.confirmationCode}\n\nTotal Cost: $${totalCost}`);
      
      // Navigate to dashboard
      window.dispatchEvent(new CustomEvent('navigate-to-dashboard'));
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderCustomizationContent = () => {
    if (customizationStep === 'flight') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Flight</h3>
            <p className="text-gray-600">Choose from available flight options</p>
          </div>

          <div className="space-y-4">
            {mockFlightOptions.map((flight) => (
              <div key={flight.id} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedFlight?.id === flight.id 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => handleFlightSelect(flight)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Plane className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{flight.airline}</span>
                        <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                      </div>
                      
                      {flight.stops === 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Non-stop
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{flight.departure.time}</div>
                        <div className="text-sm text-gray-600">{flight.departure.airport}</div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <ArrowRight className="w-4 h-4" />
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{flight.arrival.time}</div>
                        <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{flight.duration}</span>
                      </div>
                      <span>•</span>
                      <span>{flight.aircraft}</span>
                      {flight.stops > 0 && (
                        <>
                          <span>•</span>
                          <span>{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ${flight.price}
                    </div>
                    {selectedFlight?.id === flight.id && (
                      <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (customizationStep === 'hotel') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your Hotel</h3>
            <p className="text-gray-600">Choose from available hotel options</p>
          </div>

          <div className="space-y-4">
            {mockHotelOptions.map((hotel) => (
              <div key={hotel.id} className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedHotel?.id === hotel.id 
                  ? 'border-sky-500 bg-sky-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => handleHotelSelect(hotel)}>
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                        <div className="flex items-center space-x-1 mb-2">
                          {renderStars(hotel.rating)}
                          <span className="text-sm text-gray-600 ml-2">({hotel.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {hotel.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            ${hotel.originalPrice}/night
                          </div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">
                          ${hotel.price}<span className="text-sm font-normal">/night</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                      <span>•</span>
                      <span>{hotel.distance}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map((amenity, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {selectedHotel?.id === hotel.id && (
                      <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (customizationStep === 'summary') {
      const customizedCost = calculateCustomizedCost();
      const originalCost = selectedPackage?.totalCost || 0;
      const costDifference = customizedCost - originalCost;

      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Customization Summary</h3>
            <p className="text-gray-600">Review your customized selections before booking</p>
          </div>

          {/* Cost Comparison */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Original Package</div>
                <div className="text-2xl font-bold text-gray-900">${originalCost}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Your Selection</div>
                <div className="text-2xl font-bold text-sky-600">${customizedCost}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Difference</div>
                <div className={`text-2xl font-bold ${
                  costDifference > 0 ? 'text-red-600' : costDifference < 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {costDifference > 0 ? '+' : ''}${costDifference}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Flight */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Selected Flight</h4>
              </div>
              <button 
                onClick={() => setCustomizationStep('flight')}
                className="text-sky-600 text-sm font-medium hover:text-sky-700"
              >
                Change Flight
              </button>
            </div>
            
            {selectedFlight && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{selectedFlight.airline} {selectedFlight.flightNumber}</div>
                    <div className="text-sm text-gray-600">{selectedFlight.departure.time} - {selectedFlight.arrival.time}</div>
                    <div className="text-sm text-gray-600">{selectedFlight.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${selectedFlight.price}</div>
                    {selectedFlight.stops === 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Non-stop</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Hotel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">Selected Hotel</h4>
              </div>
              <button 
                onClick={() => setCustomizationStep('hotel')}
                className="text-sky-600 text-sm font-medium hover:text-sky-700"
              >
                Change Hotel
              </button>
            </div>
            
            {selectedHotel && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{selectedHotel.name}</div>
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(selectedHotel.rating)}
                      <span className="text-sm text-gray-600 ml-1">({selectedHotel.reviews} reviews)</span>
                    </div>
                    <div className="text-sm text-gray-600">{selectedHotel.location}</div>
                    <div className="text-sm text-gray-600">{selectedPackage?.hotel.nights} nights</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${selectedHotel.price * (selectedPackage?.hotel.nights || 1)}
                    </div>
                    <div className="text-sm text-gray-600">${selectedHotel.price}/night</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trip Details Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Route</div>
                <div className="font-medium">{formData.origin} → {formData.destination}</div>
              </div>
              <div>
                <div className="text-gray-600">Duration</div>
                <div className="font-medium">{selectedPackage?.hotel.nights} nights</div>
              </div>
              <div>
                <div className="text-gray-600">Travelers</div>
                <div className="font-medium">{formData.travelers}</div>
              </div>
              <div>
                <div className="text-gray-600">Style</div>
                <div className="font-medium capitalize">{formData.style}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Your Perfect Trip</h2>
              <p className="text-gray-600">Tell us your preferences and we'll create AI-powered packages for you</p>
            </div>

            <div className="space-y-6">
              {/* Basic Trip Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title (Optional)</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., European Adventure, Business Trip to Tokyo"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.origin}
                          onChange={(e) => setFormData({...formData, origin: e.target.value})}
                          placeholder="Origin city"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          placeholder="Destination city"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.travelers}
                          onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget (USD) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          placeholder="Total budget"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Style */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {styleOptions.map((style) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setFormData({...formData, style: style.id})}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.style === style.id
                            ? 'border-sky-500 bg-sky-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${style.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{style.title}</h4>
                        <p className="text-sm text-gray-600">{style.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel Pace */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Pace</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paceOptions.map((pace) => (
                    <button
                      key={pace.id}
                      type="button"
                      onClick={() => setFormData({...formData, pace: pace.id})}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.pace === pace.id
                          ? 'border-sky-500 bg-sky-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-2xl mb-3">{pace.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">{pace.title}</h4>
                      <p className="text-sm text-gray-600">{pace.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What interests you?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {preferenceOptions.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                        formData.preferences.includes(pref)
                          ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate AI Packages Button */}
              <div className="text-center pt-6">
                <button
                  onClick={generateAIPackages}
                  disabled={isGeneratingPackage || !formData.origin || !formData.destination || !formData.budget}
                  className="px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-sky-500/25 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Zap className="w-5 h-5" />
                  <span>{isGeneratingPackage ? 'Generating AI Packages...' : 'Generate AI Packages'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Packages</h2>
              <p className="text-gray-600">Choose the perfect package tailored to your preferences and budget</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {aiPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-sky-500 hover:shadow-lg transition-all duration-200">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <div className="text-3xl font-bold text-sky-600 mb-1">${pkg.totalCost}</div>
                    <div className="text-sm text-green-600">Save ${pkg.savings}</div>
                  </div>

                  {/* Flight Details */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Plane className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">Flight</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>{pkg.flight.airline} {pkg.flight.flightNumber}</div>
                      <div>{pkg.flight.departure} - {pkg.flight.arrival}</div>
                      <div>{pkg.flight.duration} • ${pkg.flight.price}</div>
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-900">Hotel</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="flex items-center space-x-1 mb-1">
                        <span>{pkg.hotel.name}</span>
                        <div className="flex items-center">
                          {renderStars(pkg.hotel.rating)}
                        </div>
                      </div>
                      <div>${pkg.hotel.price}/night • {pkg.hotel.nights} nights</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {pkg.hotel.amenities.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="mb-6 p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-900 mb-2">Included Activities</div>
                    <div className="space-y-1">
                      {pkg.activities.slice(0, 2).map((activity, idx) => (
                        <div key={idx} className="text-sm text-gray-700">
                          {activity.name} • ${activity.price}
                        </div>
                      ))}
                      {pkg.activities.length > 2 && (
                        <div className="text-xs text-purple-600">+{pkg.activities.length - 2} more activities</div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePackageSelection(pkg)}
                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Select Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        if (isCustomizing) {
          return (
            <div className="space-y-6">
              {/* Customization Header */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Package</h2>
                    <p className="text-gray-600">Select your preferred flight and hotel options</p>
                  </div>
                  <button
                    onClick={() => setIsCustomizing(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel Customization
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    customizationStep === 'flight' ? 'bg-sky-100 text-sky-800' : 
                    selectedFlight ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Plane className="w-4 h-4" />
                    <span>Flight</span>
                    {selectedFlight && <Check className="w-4 h-4" />}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    customizationStep === 'hotel' ? 'bg-sky-100 text-sky-800' : 
                    selectedHotel ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Building className="w-4 h-4" />
                    <span>Hotel</span>
                    {selectedHotel && <Check className="w-4 h-4" />}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    customizationStep === 'summary' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Check className="w-4 h-4" />
                    <span>Summary</span>
                  </div>
                </div>
              </div>

              {/* Customization Content */}
              {renderCustomizationContent()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (customizationStep === 'flight') {
                      setIsCustomizing(false);
                    } else if (customizationStep === 'hotel') {
                      setCustomizationStep('flight');
                    } else {
                      setCustomizationStep('hotel');
                    }
                  }}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                {customizationStep === 'summary' && (
                  <button
                    onClick={handleBookPackage}
                    disabled={isBooking}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Check className="w-5 h-5" />
                    <span>{isBooking ? 'Booking...' : 'Confirm & Book'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Booking</h2>
              <p className="text-gray-600">Review your selected package and confirm your booking</p>
            </div>

            {selectedPackage && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPackage.title}</h3>
                  <div className="text-4xl font-bold text-sky-600 mb-2">${selectedPackage.totalCost}</div>
                  <div className="text-lg text-green-600">You save ${selectedPackage.savings}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Flight Summary */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Flight Details</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div><strong>Airline:</strong> {selectedPackage.flight.airline}</div>
                      <div><strong>Route:</strong> {formData.origin} → {formData.destination}</div>
                      <div><strong>Departure:</strong> {selectedPackage.flight.departure}</div>
                      <div><strong>Arrival:</strong> {selectedPackage.flight.arrival}</div>
                      <div><strong>Duration:</strong> {selectedPackage.flight.duration}</div>
                      <div><strong>Price:</strong> ${selectedPackage.flight.price}</div>
                    </div>
                  </div>

                  {/* Hotel Summary */}
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Hotel Details</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div><strong>Hotel:</strong> {selectedPackage.hotel.name}</div>
                      <div className="flex items-center space-x-1">
                        <strong>Rating:</strong>
                        <div className="flex items-center ml-1">
                          {renderStars(selectedPackage.hotel.rating)}
                        </div>
                      </div>
                      <div><strong>Check-in:</strong> {formData.startDate}</div>
                      <div><strong>Check-out:</strong> {formData.endDate}</div>
                      <div><strong>Nights:</strong> {selectedPackage.hotel.nights}</div>
                      <div><strong>Total:</strong> ${selectedPackage.hotel.price * selectedPackage.hotel.nights}</div>
                    </div>
                  </div>
                </div>

                {/* Itinerary Preview */}
                <div className="mb-8 p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-3">Sample Itinerary</h4>
                  <div className="space-y-2">
                    {selectedPackage.itinerary.map((day) => (
                      <div key={day.day} className="text-sm text-gray-700">
                        <strong>Day {day.day}:</strong> {day.activities.join(' • ')}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleCustomizePackage}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-sky-600 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Customize Selections</span>
                  </button>
                  <button
                    onClick={handleBookPackage}
                    disabled={isBooking}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Check className="w-5 h-5" />
                    <span>{isBooking ? 'Booking...' : 'Confirm & Book'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
          {hasVoiceData && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span>Voice data loaded</span>
            </div>
          )}
          <div className="text-sm text-gray-500">
            Step {currentStep} of 3
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {renderStep()}

        {currentStep > 1 && !isCustomizing && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};