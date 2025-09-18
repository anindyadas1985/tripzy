import React, { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Zap, Clock, Heart, Briefcase, Baby, Plane, Building, Star, Check, Edit3 } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface AIPackage {
  id: string;
  title: string;
  totalCost: number;
  savings: number;
  flight: {
    airline: string;
    departure: string;
    arrival: string;
    price: number;
    duration: string;
  };
  hotel: {
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
  const [showCustomization, setShowCustomization] = useState(false);
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
          airline: 'Air France',
          departure: '08:00 AM',
          arrival: '09:30 PM',
          price: Math.round(budget * 0.4),
          duration: '7h 30m'
        },
        hotel: {
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
          airline: 'Delta Airlines',
          departure: '10:15 AM',
          arrival: '11:45 PM',
          price: Math.round(budget * 0.35),
          duration: '7h 30m'
        },
        hotel: {
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
          airline: 'Lufthansa',
          departure: '02:20 PM',
          arrival: '09:15 AM+1',
          price: Math.round(budget * 0.3),
          duration: '9h 55m (1 stop)'
        },
        hotel: {
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
    setCurrentStep(3);
  };

  const handleBookPackage = async () => {
    if (!selectedPackage) return;
    
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
        provider: selectedPackage.flight.airline,
        confirmationCode: `FL${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(formData.startDate),
        cost: selectedPackage.flight.price,
        status: 'confirmed' as const,
        details: {
          departure: selectedPackage.flight.departure,
          arrival: selectedPackage.flight.arrival,
          duration: selectedPackage.flight.duration
        }
      };

      const hotelBooking = {
        id: (Date.now() + 1).toString(),
        tripId: 'current-trip',
        type: 'hotel' as const,
        title: selectedPackage.hotel.name,
        provider: 'Booking.com',
        confirmationCode: `HT${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(formData.startDate),
        cost: selectedPackage.hotel.price * selectedPackage.hotel.nights,
        status: 'confirmed' as const,
        details: {
          rating: selectedPackage.hotel.rating,
          nights: selectedPackage.hotel.nights,
          amenities: selectedPackage.hotel.amenities.join(', '),
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
      
      alert(`🎉 Trip booked successfully!\n\nFlight: ${flightBooking.confirmationCode}\nHotel: ${hotelBooking.confirmationCode}\n\nTotal Cost: $${selectedPackage.totalCost}`);
      
      // Navigate to dashboard
      window.dispatchEvent(new CustomEvent('navigate-to-dashboard'));
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCustomizePackage = () => {
    setShowCustomization(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
                      <div>{pkg.flight.airline}</div>
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

                {!showCustomization ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCustomizePackage}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-sky-600 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Customize Package</span>
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
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Customization Options</h4>
                      <p className="text-sm text-yellow-800">
                        You can modify flight times, hotel selection, and activities. Additional charges may apply for upgrades.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50">
                        <div className="font-medium text-gray-900">Change Flight</div>
                        <div className="text-sm text-gray-600">Select different flight times or airlines</div>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50">
                        <div className="font-medium text-gray-900">Upgrade Hotel</div>
                        <div className="text-sm text-gray-600">Choose a different hotel or room type</div>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50">
                        <div className="font-medium text-gray-900">Modify Activities</div>
                        <div className="text-sm text-gray-600">Add or remove activities from your package</div>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50">
                        <div className="font-medium text-gray-900">Add Services</div>
                        <div className="text-sm text-gray-600">Airport transfers, travel insurance, etc.</div>
                      </button>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={() => setShowCustomization(false)}
                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Keep Original
                      </button>
                      <button
                        onClick={handleBookPackage}
                        disabled={isBooking}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Check className="w-5 h-5" />
                        <span>{isBooking ? 'Booking...' : 'Book with Changes'}</span>
                      </button>
                    </div>
                  </div>
                )}
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

        {currentStep === 1 && (
          <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={generateAIPackages}
              disabled={isGeneratingPackage}
              className="px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-sky-500/25 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Zap className="w-5 h-5" />
              <span>{isGeneratingPackage ? 'Generating AI Packages...' : 'Generate AI Packages'}</span>
            </button>
          </div>
        )}

        {currentStep > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};