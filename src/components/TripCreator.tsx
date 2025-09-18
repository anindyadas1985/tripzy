import React, { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Users, DollarSign, Plane, ArrowRight, 
  Check, Star, Clock, Sparkles, Plus, Minus, ChevronLeft,
  ChevronRight, Heart, Camera, Mountain, Utensils, Building,
  Car, Activity, Coffee, ShoppingBag, Music, Palette
} from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface TripFormData {
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  style: 'leisure' | 'business' | 'family';
  pace: 'relaxed' | 'moderate' | 'packed';
  preferences: string[];
  specialRequirements: string;
}

interface AIPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  highlights: string[];
  price: number;
  rating: number;
  image: string;
  included: string[];
}

interface CustomPackageItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'transport' | 'meal';
  title: string;
  description: string;
  price: number;
  duration?: string;
  rating?: number;
  image?: string;
  selected: boolean;
}

export const TripCreator: React.FC = () => {
  const { createTrip, setActiveTrip } = useTripContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAIPackages, setShowAIPackages] = useState(false);
  const [showCustomPackages, setShowCustomPackages] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<AIPackage | null>(null);
  const [customItems, setCustomItems] = useState<CustomPackageItem[]>([]);
  const [isGeneratingPackages, setIsGeneratingPackages] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 100000,
    style: 'leisure',
    pace: 'moderate',
    preferences: [],
    specialRequirements: ''
  });

  // Load voice trip data if available
  useEffect(() => {
    const voiceData = localStorage.getItem('voiceTripData');
    if (voiceData) {
      try {
        const parsedData = JSON.parse(voiceData);
        setFormData(prev => ({
          ...prev,
          ...parsedData,
          startDate: parsedData.startDate ? new Date(parsedData.startDate).toISOString().split('T')[0] : '',
          endDate: parsedData.endDate ? new Date(parsedData.endDate).toISOString().split('T')[0] : ''
        }));
        localStorage.removeItem('voiceTripData');
      } catch (error) {
        console.error('Error parsing voice data:', error);
      }
    }
  }, []);

  const mockAIPackages: AIPackage[] = [
    {
      id: '1',
      title: 'Romantic Paris Getaway',
      description: 'Perfect blend of culture, cuisine, and romance in the City of Light',
      duration: '7 days, 6 nights',
      highlights: ['Eiffel Tower sunset', 'Seine river cruise', 'Louvre Museum', 'Montmartre exploration'],
      price: 185000,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
      included: ['Round-trip flights', '4-star hotel', 'Daily breakfast', 'City tour', 'Museum passes']
    },
    {
      id: '2',
      title: 'Cultural Paris Experience',
      description: 'Immerse yourself in art, history, and French culture',
      duration: '7 days, 6 nights',
      highlights: ['Multiple museums', 'Art galleries', 'Historical sites', 'Local workshops'],
      price: 165000,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/161853/paris-sunset-france-monument-161853.jpeg',
      included: ['Round-trip flights', 'Boutique hotel', 'Cultural tours', 'Workshop sessions', 'Local guide']
    },
    {
      id: '3',
      title: 'Paris Food & Wine Tour',
      description: 'Culinary journey through the best of French gastronomy',
      duration: '7 days, 6 nights',
      highlights: ['Michelin restaurants', 'Wine tastings', 'Cooking classes', 'Market tours'],
      price: 225000,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg',
      included: ['Round-trip flights', 'Luxury hotel', 'All meals', 'Wine tours', 'Cooking classes']
    }
  ];

  const mockCustomItems: CustomPackageItem[] = [
    {
      id: 'flight-1',
      type: 'flight',
      title: 'Air France Direct Flight',
      description: 'DEL to CDG, Premium Economy',
      price: 65000,
      duration: '8h 30m',
      rating: 4.5,
      selected: false
    },
    {
      id: 'flight-2',
      type: 'flight',
      title: 'Emirates via Dubai',
      description: 'DEL to CDG via DXB, Business Class',
      price: 125000,
      duration: '12h 45m',
      rating: 4.8,
      selected: false
    },
    {
      id: 'hotel-1',
      type: 'hotel',
      title: 'Hotel Le Marais',
      description: 'Boutique hotel in historic district',
      price: 18000,
      duration: 'per night',
      rating: 4.6,
      selected: false
    },
    {
      id: 'hotel-2',
      type: 'hotel',
      title: 'Shangri-La Paris',
      description: 'Luxury hotel with Eiffel Tower view',
      price: 45000,
      duration: 'per night',
      rating: 4.9,
      selected: false
    },
    {
      id: 'activity-1',
      type: 'activity',
      title: 'Eiffel Tower Skip-the-Line',
      description: 'Priority access with guided tour',
      price: 3500,
      duration: '2 hours',
      rating: 4.7,
      selected: false
    },
    {
      id: 'activity-2',
      type: 'activity',
      title: 'Seine River Dinner Cruise',
      description: 'Romantic dinner cruise with live music',
      price: 8500,
      duration: '3 hours',
      rating: 4.8,
      selected: false
    },
    {
      id: 'transport-1',
      type: 'transport',
      title: 'Airport Transfer',
      description: 'Private car service to/from airport',
      price: 4500,
      duration: '1 hour',
      rating: 4.5,
      selected: false
    },
    {
      id: 'meal-1',
      type: 'meal',
      title: 'Le Comptoir du Relais',
      description: 'Traditional French bistro experience',
      price: 6500,
      duration: '2 hours',
      rating: 4.6,
      selected: false
    }
  ];

  const preferences = [
    { id: 'culture', label: 'Cultural Sites', icon: Building },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'adventure', label: 'Adventure Sports', icon: Mountain },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'nightlife', label: 'Nightlife', icon: Music },
    { id: 'art', label: 'Art & Museums', icon: Palette },
    { id: 'nature', label: 'Nature & Parks', icon: Mountain },
    { id: 'relaxation', label: 'Spa & Wellness', icon: Heart },
    { id: 'transport', label: 'Local Transport', icon: Car },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'coffee', label: 'Cafes & Coffee', icon: Coffee }
  ];

  const handleInputChange = (field: keyof TripFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceToggle = (preferenceId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preferenceId)
        ? prev.preferences.filter(p => p !== preferenceId)
        : [...prev.preferences, preferenceId]
    }));
  };

  const generateAIPackages = async () => {
    setIsGeneratingPackages(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingPackages(false);
    setShowAIPackages(true);
  };

  const generateCustomPackages = async () => {
    setIsGeneratingPackages(true);
    // Simulate loading custom options
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCustomItems(mockCustomItems);
    setIsGeneratingPackages(false);
    setShowCustomPackages(true);
  };

  const handleCustomItemToggle = (itemId: string) => {
    setCustomItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
  };

  const getSelectedCustomItems = () => {
    return customItems.filter(item => item.selected);
  };

  const getCustomPackageTotal = () => {
    return getSelectedCustomItems().reduce((total, item) => total + item.price, 0);
  };

  const handleAIPackageSelect = (pkg: AIPackage) => {
    setSelectedPackage(pkg);
    setShowBookingConfirmation(true);
  };

  const handleCustomPackageConfirm = () => {
    const selectedItems = getSelectedCustomItems();
    if (selectedItems.length === 0) {
      alert('Please select at least one item to continue');
      return;
    }
    setShowBookingConfirmation(true);
  };

  const confirmBooking = () => {
    const tripData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      image: selectedPackage?.image || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg'
    };

    const newTrip = createTrip(tripData);
    setActiveTrip(newTrip);
    
    // Reset form
    setCurrentStep(1);
    setShowAIPackages(false);
    setShowCustomPackages(false);
    setShowBookingConfirmation(false);
    setSelectedPackage(null);
    setCustomItems([]);
    
    // Navigate to dashboard
    window.dispatchEvent(new CustomEvent('navigate-to-dashboard'));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Building;
      case 'activity': return Activity;
      case 'transport': return Car;
      case 'meal': return Utensils;
      default: return Star;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'flight': return 'from-sky-500 to-blue-600';
      case 'hotel': return 'from-purple-500 to-indigo-600';
      case 'activity': return 'from-pink-500 to-rose-600';
      case 'transport': return 'from-green-500 to-emerald-600';
      case 'meal': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Booking Confirmation Modal
  if (showBookingConfirmation) {
    const isCustomPackage = !selectedPackage;
    const selectedItems = getSelectedCustomItems();
    const totalPrice = isCustomPackage ? getCustomPackageTotal() : selectedPackage?.price || 0;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Booking Confirmation</h1>
                <p className="text-sky-100">Review your trip details before confirming</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Trip Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Summary</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {isCustomPackage ? 'Custom Package' : selectedPackage?.title}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{formData.origin} → {formData.destination}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formData.startDate} to {formData.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{formData.travelers} travelers</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Price</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isCustomPackage ? 'Selected Items' : 'Package Includes'}
              </h2>
              
              {isCustomPackage ? (
                <div className="space-y-4">
                  {selectedItems.map((item) => {
                    const Icon = getStepIcon(item.type);
                    const colorClass = getStepColor(item.type);
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            {item.duration && (
                              <p className="text-xs text-gray-500">{item.duration}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</div>
                          {item.rating && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPackage?.included.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingConfirmation(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back to Selection
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI Packages View
  if (showAIPackages) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => setShowAIPackages(false)}
            className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Trip Details</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Generated Packages</h1>
          <p className="text-gray-600">Curated packages based on your preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAIPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm text-gray-600">{pkg.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                <p className="text-sky-600 text-sm font-medium mb-4">{pkg.duration}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
                  <ul className="space-y-1">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-3 h-3 text-green-600" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                  <button
                    onClick={() => handleAIPackageSelect(pkg)}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Select Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Custom Packages View
  if (showCustomPackages) {
    const selectedItems = getSelectedCustomItems();
    const totalPrice = getCustomPackageTotal();

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => setShowCustomPackages(false)}
            className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Trip Details</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Custom Package</h1>
              <p className="text-gray-600">Select individual components for your trip</p>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{selectedItems.length} items selected</div>
                  <button
                    onClick={handleCustomPackageConfirm}
                    className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Continue to Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Items by Category */}
        {['flight', 'hotel', 'activity', 'transport', 'meal'].map((category) => {
          const categoryItems = customItems.filter(item => item.type === category);
          if (categoryItems.length === 0) return null;

          const Icon = getStepIcon(category);
          const colorClass = getStepColor(category);

          return (
            <div key={category} className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 capitalize">{category}s</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      item.selected
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCustomItemToggle(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        {item.duration && (
                          <p className="text-xs text-gray-500 mt-1">{item.duration}</p>
                        )}
                        {item.rating && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                            <span className="text-xs text-gray-600">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</div>
                        <div className={`w-5 h-5 rounded-full border-2 mt-2 ${
                          item.selected
                            ? 'bg-sky-600 border-sky-600'
                            : 'border-gray-300'
                        }`}>
                          {item.selected && <Check className="w-3 h-3 text-white m-0.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Main Trip Creator Form
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Perfect Trip</h1>
        <p className="text-gray-600">Tell us about your dream destination and we'll create an amazing itinerary</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-24 h-1 mx-4 ${
                  currentStep > step ? 'bg-sky-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Basic Details</span>
          <span>Preferences</span>
          <span>Generate Packages</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Trip Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Paris Adventure 2025"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('travelers', Math.max(1, formData.travelers - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900 w-12 text-center">{formData.travelers}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('travelers', formData.travelers + 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="e.g., Delhi, India"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="e.g., Paris, France"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                placeholder="100000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Travel Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Trip Style</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'leisure', label: 'Leisure', desc: 'Relaxed vacation' },
                  { value: 'business', label: 'Business', desc: 'Work & meetings' },
                  { value: 'family', label: 'Family', desc: 'Family-friendly' }
                ].map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => handleInputChange('style', style.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.style === style.value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Trip Pace</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'relaxed', label: 'Relaxed', desc: 'Take it easy' },
                  { value: 'moderate', label: 'Moderate', desc: 'Balanced schedule' },
                  { value: 'packed', label: 'Packed', desc: 'See everything' }
                ].map((pace) => (
                  <button
                    key={pace.value}
                    type="button"
                    onClick={() => handleInputChange('pace', pace.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.pace === pace.value
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{pace.label}</div>
                    <div className="text-sm text-gray-600">{pace.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {preferences.map((pref) => {
                  const Icon = pref.icon;
                  return (
                    <button
                      key={pref.id}
                      type="button"
                      onClick={() => handlePreferenceToggle(pref.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.preferences.includes(pref.id)
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-gray-600 mb-2" />
                      <div className="text-sm font-medium text-gray-900">{pref.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Any special needs, dietary restrictions, accessibility requirements, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Generate Packages */}
        {currentStep === 3 && (
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Package Type</h2>
              <p className="text-gray-600">Let AI create packages for you or build your own custom package</p>
            </div>

            {isGeneratingPackages ? (
              <div className="py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">Generating your perfect packages...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Generated Packages</h3>
                  <p className="text-gray-600 mb-6">
                    Let our AI create curated packages based on your preferences, budget, and travel style.
                  </p>
                  <button
                    onClick={generateAIPackages}
                    className="w-full px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Generate AI Packages
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Package</h3>
                  <p className="text-gray-600 mb-6">
                    Build your own package by selecting individual flights, hotels, activities, and more.
                  </p>
                  <button
                    onClick={generateCustomPackages}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Build Custom Package
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 3 && (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};