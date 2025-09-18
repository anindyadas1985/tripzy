import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, ArrowLeft, Check, Sparkles, Plane, Building, Activity, Clock, Star, Wifi, Car, Coffee } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface TripFormData {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  style: 'leisure' | 'business' | 'family';
  pace: 'relaxed' | 'moderate' | 'packed';
  interests: string[];
  specialRequirements: string;
  planningStyle: 'ai' | 'custom';
}

interface FlightOption {
  id: string;
  airline: string;
  class: string;
  price: number;
  duration: string;
  stops: number;
}

interface HotelOption {
  id: string;
  name: string;
  stars: number;
  price: number;
  amenities: string[];
  location: string;
}

interface ActivityPackage {
  id: string;
  name: string;
  activities: string[];
  duration: string;
  price: number;
}

interface CustomPackage {
  flight?: FlightOption;
  hotel?: HotelOption;
  activities?: ActivityPackage;
  total: number;
}

export const TripCreator: React.FC = () => {
  const { createTrip } = useTripContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [builderStep, setBuilderStep] = useState(1);
  const [customPackage, setCustomPackage] = useState<CustomPackage>({ total: 0 });
  const [showFinalComparison, setShowFinalComparison] = useState(false);

  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    origin: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 50000,
    style: 'leisure',
    pace: 'moderate',
    interests: [],
    specialRequirements: '',
    planningStyle: 'ai'
  });

  // Load voice data if available
  useEffect(() => {
    const voiceData = localStorage.getItem('voiceTripData');
    if (voiceData) {
      try {
        const parsed = JSON.parse(voiceData);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          startDate: parsed.startDate ? new Date(parsed.startDate).toISOString().split('T')[0] : '',
          endDate: parsed.endDate ? new Date(parsed.endDate).toISOString().split('T')[0] : ''
        }));
        localStorage.removeItem('voiceTripData');
      } catch (error) {
        console.error('Error parsing voice data:', error);
      }
    }
  }, []);

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const interestOptions = [
    'Cultural Sites', 'Food & Dining', 'Adventure Sports', 'Photography',
    'Shopping', 'Nightlife', 'Nature & Parks', 'Museums', 'Architecture',
    'Beaches', 'Mountains', 'History', 'Art', 'Music', 'Local Experiences'
  ];

  const flightOptions: FlightOption[] = [
    {
      id: 'flight1',
      airline: 'Air India',
      class: 'Economy',
      price: 35000,
      duration: '8h 30m',
      stops: 0
    },
    {
      id: 'flight2',
      airline: 'Emirates',
      class: 'Economy',
      price: 45000,
      duration: '9h 15m',
      stops: 1
    },
    {
      id: 'flight3',
      airline: 'Lufthansa',
      class: 'Business',
      price: 85000,
      duration: '8h 45m',
      stops: 0
    }
  ];

  const hotelOptions: HotelOption[] = [
    {
      id: 'hotel1',
      name: 'Budget Inn Central',
      stars: 3,
      price: 4000,
      amenities: ['Free WiFi', 'Breakfast'],
      location: 'City Center'
    },
    {
      id: 'hotel2',
      name: 'Grand Plaza Hotel',
      stars: 4,
      price: 8000,
      amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant'],
      location: 'Downtown'
    },
    {
      id: 'hotel3',
      name: 'Luxury Palace Resort',
      stars: 5,
      price: 15000,
      amenities: ['Free WiFi', 'Spa', 'Pool', 'Concierge', 'Room Service'],
      location: 'Premium District'
    }
  ];

  const activityPackages: ActivityPackage[] = [
    {
      id: 'activities1',
      name: 'Essential Explorer',
      activities: ['City Tour', 'Local Market Visit', 'Cultural Show'],
      duration: '3 days',
      price: 12000
    },
    {
      id: 'activities2',
      name: 'Cultural Immersion',
      activities: ['Museum Tours', 'Historical Sites', 'Art Galleries', 'Local Workshops'],
      duration: '4 days',
      price: 18000
    },
    {
      id: 'activities3',
      name: 'Premium Experience',
      activities: ['Private Tours', 'Fine Dining', 'VIP Access', 'Personal Guide'],
      duration: '5 days',
      price: 35000
    }
  ];

  const handleInputChange = (field: keyof TripFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addQuickRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements 
        ? `${prev.specialRequirements}, ${requirement}`
        : requirement
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlanningStyleSelect = (style: 'ai' | 'custom') => {
    setFormData(prev => ({ ...prev, planningStyle: style }));
    if (style === 'ai') {
      setShowComparison(true);
    } else {
      setShowCustomBuilder(true);
    }
  };

  const selectFlight = (flight: FlightOption) => {
    const flightCost = flight.price * formData.travelers;
    setCustomPackage(prev => ({
      ...prev,
      flight,
      total: prev.total - (prev.flight ? prev.flight.price * formData.travelers : 0) + flightCost
    }));
  };

  const selectHotel = (hotel: HotelOption) => {
    const hotelCost = hotel.price * 7; // 7 nights
    setCustomPackage(prev => ({
      ...prev,
      hotel,
      total: prev.total - (prev.hotel ? prev.hotel.price * 7 : 0) + hotelCost
    }));
  };

  const selectActivities = (activities: ActivityPackage) => {
    setCustomPackage(prev => ({
      ...prev,
      activities,
      total: prev.total - (prev.activities ? prev.activities.price : 0) + activities.price
    }));
  };

  const nextBuilderStep = () => {
    if (builderStep < 3) {
      setBuilderStep(builderStep + 1);
    } else {
      setShowFinalComparison(true);
      setShowCustomBuilder(false);
    }
  };

  const prevBuilderStep = () => {
    if (builderStep > 1) {
      setBuilderStep(builderStep - 1);
    }
  };

  const skipBuilderStep = () => {
    nextBuilderStep();
  };

  const handleCustomizePackage = () => {
    setShowComparison(false);
    setShowCustomBuilder(true);
    setBuilderStep(1);
    setCustomPackage({ total: 0 });
  };

  const handleBookPackage = (packageType: 'ai' | 'custom') => {
    const tripData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      packageType,
      customPackage: packageType === 'custom' ? customPackage : undefined
    };
    
    const newTrip = createTrip(tripData);
    window.dispatchEvent(new CustomEvent('navigate-to-booking'));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Basics</h2>
              <p className="text-gray-600">Let's start with the essentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  From (Origin)
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="Delhi, India"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  To (Destination)
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="Paris, France"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Number of Travelers
                </label>
                <select
                  value={formData.travelers}
                  onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget (₹)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                  placeholder="50000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel Preferences</h2>
              <p className="text-gray-600">Tell us about your travel style</p>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Trip Style</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'leisure', label: 'Leisure', icon: '🏖️', desc: 'Relaxation and fun' },
                    { value: 'business', label: 'Business', icon: '💼', desc: 'Work and meetings' },
                    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Family-friendly activities' }
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => handleInputChange('style', style.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.style === style.value
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Travel Pace</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'relaxed', label: 'Relaxed', icon: '🧘', desc: 'Take it slow' },
                    { value: 'moderate', label: 'Moderate', icon: '🚶', desc: 'Balanced schedule' },
                    { value: 'packed', label: 'Packed', icon: '🏃', desc: 'See everything' }
                  ].map((pace) => (
                    <button
                      key={pace.value}
                      onClick={() => handleInputChange('pace', pace.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.pace === pace.value
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{pace.icon}</div>
                      <div className="font-medium">{pace.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{pace.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Interests</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Special Requirements</h2>
              <p className="text-gray-600">Any specific needs or preferences?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Quick Add</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'Wheelchair accessible',
                    'Vegetarian meals',
                    'Pet-friendly',
                    'WiFi required',
                    'Airport pickup',
                    'Travel insurance',
                    'Local SIM card',
                    'Currency exchange'
                  ].map((req) => (
                    <button
                      key={req}
                      onClick={() => addQuickRequirement(req)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      + {req}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any other specific requirements or preferences..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Planning Style</h2>
              <p className="text-gray-600">How would you like to plan your trip?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handlePlanningStyleSelect('ai')}
                className="p-8 border-2 border-gray-200 rounded-2xl hover:border-sky-500 hover:bg-sky-50 transition-all group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI Recommended</h3>
                  <p className="text-gray-600 mb-4">Let our AI create the perfect itinerary based on your preferences</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Instant planning</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Best deals</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Optimized schedule</span>
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handlePlanningStyleSelect('custom')}
                className="p-8 border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Planning</h3>
                  <p className="text-gray-600 mb-4">Build your trip step by step with full control</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Full control</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Flexible options</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Personal touch</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Generated Package</h2>
              <p className="text-gray-600">Here's your personalized travel package</p>
            </div>

            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formData.origin} → {formData.destination}</h3>
                  <p className="text-gray-600">{formData.travelers} travelers • 7 days</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-600">₹{(105000).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 line-through">₹{(120000).toLocaleString()}</div>
                  <div className="text-sm text-green-600 font-medium">Save ₹15,000</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Plane className="w-6 h-6 text-sky-600" />
                    <h4 className="font-semibold text-gray-900">Flights</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Air India • Economy</div>
                    <div>Direct flight • 8h 30m</div>
                    <div className="font-medium text-gray-900">₹45,000 per person</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Hotel</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Grand Plaza Hotel • 4★</div>
                    <div>7 nights • City Center</div>
                    <div className="font-medium text-gray-900">₹42,000 total</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Activities</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Cultural Immersion Package</div>
                    <div>4 days of guided tours</div>
                    <div className="font-medium text-gray-900">₹18,000 total</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleBookPackage('ai')}
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Book This Package
                </button>
                <button
                  onClick={handleCustomizePackage}
                  className="flex-1 bg-white text-sky-600 py-4 px-6 rounded-xl font-semibold border-2 border-sky-600 hover:bg-sky-50 transition-colors"
                >
                  Customize Package
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderCustomBuilder = () => {
    const builderProgress = (builderStep / 3) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Build Your Package</h2>
            <p className="text-gray-600">Step {builderStep} of 3 • Total: ₹{customPackage.total.toLocaleString()}</p>
          </div>
          <button
            onClick={() => {
              setShowCustomBuilder(false);
              setShowComparison(true);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Comparison
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${builderProgress}%` }}
          />
        </div>

        {builderStep === 1 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Select Flight (Optional)</h3>
              <button
                onClick={skipBuilderStep}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Skip →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {flightOptions.map((flight) => (
                <div
                  key={flight.id}
                  onClick={() => selectFlight(flight)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    customPackage.flight?.id === flight.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{flight.airline}</h4>
                      <p className="text-gray-600">{flight.class} • {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{(flight.price * formData.travelers).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">₹{flight.price.toLocaleString()} per person</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builderStep === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Select Hotel (Optional)</h3>
              <button
                onClick={skipBuilderStep}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Skip →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {hotelOptions.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => selectHotel(hotel)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    customPackage.hotel?.id === hotel.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        {Array.from({ length: hotel.stars }, (_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-gray-600">• {hotel.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {hotel.amenities.map((amenity, index) => (
                          <span key={index} className="flex items-center space-x-1">
                            {amenity === 'Free WiFi' && <Wifi className="w-3 h-3" />}
                            {amenity === 'Pool' && <span>🏊</span>}
                            {amenity === 'Gym' && <span>💪</span>}
                            {amenity === 'Restaurant' && <Coffee className="w-3 h-3" />}
                            {amenity === 'Spa' && <span>🧖</span>}
                            {amenity === 'Concierge' && <span>🛎️</span>}
                            {amenity === 'Room Service' && <span>🍽️</span>}
                            {amenity === 'Breakfast' && <span>🥐</span>}
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{(hotel.price * 7).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">₹{hotel.price.toLocaleString()} per night</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {builderStep === 3 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Select Activities (Optional)</h3>
              <button
                onClick={skipBuilderStep}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Skip →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activityPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => selectActivities(pkg)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    customPackage.activities?.id === pkg.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                      <p className="text-gray-600 mb-2">{pkg.duration}</p>
                      <div className="space-y-1">
                        {pkg.activities.map((activity, index) => (
                          <div key={index} className="text-sm text-gray-600">• {activity}</div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total package</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6">
          <button
            onClick={prevBuilderStep}
            disabled={builderStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextBuilderStep}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
          >
            <span>{builderStep === 3 ? 'Complete Package' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderFinalComparison = () => {
    const aiPackageTotal = 105000;
    const customTotal = customPackage.total;
    const difference = customTotal - aiPackageTotal;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Perfect Package</h2>
          <p className="text-gray-600">Compare and select the package that excites you most</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Package */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border-2 border-sky-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span className="px-3 py-1 bg-sky-100 text-sky-800 text-sm font-medium rounded-full">Best Value</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-sky-600">₹{aiPackageTotal.toLocaleString()}</div>
                <div className="text-sm text-green-600">Save ₹15,000</div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Recommended Package</h3>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Flight</h4>
                    <p className="text-sm text-gray-600">Air India • Economy • Direct</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹45,000</div>
                    <div className="text-xs text-green-600">Best deal</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Hotel</h4>
                    <p className="text-sm text-gray-600">Grand Plaza • 4★ • 7 nights</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹42,000</div>
                    <div className="text-xs text-green-600">Great value</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Activities</h4>
                    <p className="text-sm text-gray-600">Cultural Immersion • 4 days</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹18,000</div>
                    <div className="text-xs text-green-600">Curated</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBookPackage('ai')}
              className="w-full mt-6 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Select AI Package
            </button>
          </div>

          {/* Custom Package */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">Your Choice</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">₹{customTotal.toLocaleString()}</div>
                <div className={`text-sm ${difference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {difference > 0 ? `+₹${difference.toLocaleString()} premium` : `Save ₹${Math.abs(difference).toLocaleString()}`}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Custom Package</h3>

            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${customPackage.flight ? 'bg-white' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Flight</h4>
                    <p className="text-sm text-gray-600">
                      {customPackage.flight 
                        ? `${customPackage.flight.airline} • ${customPackage.flight.class}`
                        : 'No flight selected - You\'ll book separately'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {customPackage.flight ? `₹${(customPackage.flight.price * formData.travelers).toLocaleString()}` : '₹0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 ${customPackage.hotel ? 'bg-white' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Hotel</h4>
                    <p className="text-sm text-gray-600">
                      {customPackage.hotel 
                        ? `${customPackage.hotel.name} • ${customPackage.hotel.stars}★`
                        : 'No hotel selected - You\'ll book separately'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {customPackage.hotel ? `₹${(customPackage.hotel.price * 7).toLocaleString()}` : '₹0'}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 ${customPackage.activities ? 'bg-white' : 'bg-gray-50 border-2 border-dashed border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Activities</h4>
                    <p className="text-sm text-gray-600">
                      {customPackage.activities 
                        ? `${customPackage.activities.name} • ${customPackage.activities.duration}`
                        : 'No activities selected - You\'ll book separately'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {customPackage.activities ? `₹${customPackage.activities.price.toLocaleString()}` : '₹0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowFinalComparison(false);
                  setShowCustomBuilder(true);
                }}
                className="flex-1 bg-white text-purple-600 py-3 px-6 rounded-xl font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
              >
                ← Modify Custom Package
              </button>
              <button
                onClick={() => handleBookPackage('custom')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                Select Custom Package
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-booking'))}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Or build from scratch in Booking Hub →
          </button>
        </div>
      </div>
    );
  };

  if (showFinalComparison) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderFinalComparison()}
      </div>
    );
  }

  if (showCustomBuilder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCustomBuilder()}
      </div>
    );
  }

  if (showComparison) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h2>
            <p className="text-gray-600">AI recommended vs Premium custom options</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Package */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8 border-2 border-sky-200">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-sky-100 text-sky-800 text-sm font-medium rounded-full">Best Value</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-600">₹105,000</div>
                  <div className="text-sm text-green-600">Save ₹15,000</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Recommended</h3>

              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✈️ Smart Flight Package</h4>
                  <p className="text-gray-600 text-sm">Economy class with best timing</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹45,000</div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🏨 Comfort Hotel Package</h4>
                  <p className="text-gray-600 text-sm">4-star hotel in prime location</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹42,000</div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎭 Cultural Experience Package</h4>
                  <p className="text-gray-600 text-sm">Curated local experiences</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹18,000</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Package Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>⚡ Setup Speed</span>
                    <span className="text-green-600 font-medium">Instant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>💰 Value</span>
                    <span className="text-green-600 font-medium">Best deals</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>🎯 Customization</span>
                    <span className="text-blue-600 font-medium">Smart defaults</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBookPackage('ai')}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Select AI Package
              </button>
            </div>

            {/* Custom Premium Package */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">Luxury</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">₹185,000</div>
                  <div className="text-sm text-orange-600">Premium experience</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">Custom Premium</h3>

              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✈️ Premium Flight Package</h4>
                  <p className="text-gray-600 text-sm">Business class with priority boarding</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹85,000</div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🏨 Luxury Hotel Package</h4>
                  <p className="text-gray-600 text-sm">5-star suite with spa access</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹65,000</div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🎭 Premium Experience Package</h4>
                  <p className="text-gray-600 text-sm">VIP tours with private guide</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">₹35,000</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Package Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>⚡ Setup Speed</span>
                    <span className="text-orange-600 font-medium">15-30 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>💰 Value</span>
                    <span className="text-purple-600 font-medium">Premium options</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>🎯 Customization</span>
                    <span className="text-green-600 font-medium">Full control</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCustomizePackage}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                Customize Package
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-booking'))}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Or build from scratch in Booking Hub →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Your Trip</h1>
            <p className="text-gray-600">Let's plan your perfect adventure</p>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {renderStepContent()}

        {currentStep < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};