import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, DollarSign, Heart, Briefcase, Baby, Zap, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

export const TripCreator: React.FC = () => {
  const { createTrip, setActiveTrip } = useTripContext();
  const [isFromVoice, setIsFromVoice] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Custom package builder state
  const [customPackage, setCustomPackage] = useState({
    flight: null as any,
    hotel: null as any,
    activities: null as any,
    totalCost: 0
  });
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [builderStep, setBuilderStep] = useState<'flight' | 'hotel' | 'activities' | 'summary'>('flight');
  // Check for voice data on component mount
  useEffect(() => {
    const voiceData = localStorage.getItem('voiceTripData');
    if (voiceData) {
      try {
        const parsedVoiceData = JSON.parse(voiceData);
        setFormData(prev => ({
          ...prev,
          title: parsedVoiceData.title || '',
          origin: parsedVoiceData.origin || '',
          destination: parsedVoiceData.destination || '',
          startDate: parsedVoiceData.startDate ? new Date(parsedVoiceData.startDate).toISOString().split('T')[0] : '',
          endDate: parsedVoiceData.endDate ? new Date(parsedVoiceData.endDate).toISOString().split('T')[0] : '',
          travelers: parsedVoiceData.travelers || 1,
          budget: parsedVoiceData.budget?.toString() || '',
          style: parsedVoiceData.style || 'leisure',
          pace: parsedVoiceData.pace || 'moderate',
          preferences: parsedVoiceData.preferences || []
        }));
        setIsFromVoice(true);
        localStorage.removeItem('voiceTripData');
      } catch (error) {
        console.error('Error parsing voice data:', error);
      }
    }
  }, []);

  const styleOptions = [
    {
      id: 'leisure' as const,
      title: 'Leisure',
      description: 'Relaxation & sightseeing',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'business' as const,
      title: 'Business',
      description: 'Meetings & conferences',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'family' as const,
      title: 'Family',
      description: 'Kid-friendly activities',
      icon: Baby,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const paceOptions = [
    {
      id: 'relaxed' as const,
      title: 'Relaxed',
      description: '2-3 activities/day',
      icon: '🌅'
    },
    {
      id: 'moderate' as const,
      title: 'Moderate',
      description: '4-5 activities/day',
      icon: '⚖️'
    },
    {
      id: 'packed' as const,
      title: 'Packed',
      description: '6+ activities/day',
      icon: '⚡'
    }
  ];

  const preferenceOptions = [
    'Cultural Sites', 'Museums', 'Food & Dining', 'Adventure Sports', 
    'Relaxation & Spa', 'Photography', 'Shopping', 'Nightlife', 
    'Nature & Parks', 'History', 'Art Galleries', 'Local Markets',
    'Architecture', 'Music & Entertainment', 'Beaches', 'Mountains'
  ];

  const commonRequirements = [
    'Wheelchair accessibility',
    'Guide assistance',
    'Vegetarian meals',
    'Halal food',
    'Child-friendly activities',
    'Senior-friendly pace',
    'Medical assistance',
    'Language interpreter'
  ];

  const togglePreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const addRequirement = (req: string) => {
    if (!formData.specialRequirements.includes(req)) {
      setFormData(prev => ({
        ...prev,
        specialRequirements: prev.specialRequirements 
          ? `${prev.specialRequirements}, ${req}` 
          : req
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    if (isFromVoice) {
      setCurrentStep(5); // Go directly to AI package for voice users
    } else {
      setCurrentStep(4); // Go to planning style selection
    }
  };

  const selectAIPackage = () => {
    setCurrentStep(5);
  };

  const selectCustomBuilder = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-booking'));
  };

  const bookPackage = () => {
    // In a real app, this would process the booking
    alert('Package booked successfully! You will receive confirmation details shortly.');
    window.dispatchEvent(new CustomEvent('navigate-to-dashboard'));
  };

  const customizePackage = () => {
    setShowCustomBuilder(true);
    setBuilderStep('flight');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you going?</h2>
              <p className="text-gray-600">Tell us about your trip basics</p>
              {isFromVoice && (
                <div className="mt-3 px-4 py-2 bg-sky-100 text-sky-800 rounded-lg inline-block">
                  ✨ Pre-filled from your voice input
                </div>
              )}
            </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      placeholder="Total budget"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us your preferences</h2>
              <p className="text-gray-600">This helps us customize your perfect itinerary</p>
            </div>

            {/* Travel Style */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's your travel style?</h3>
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
                          ? 'border-sky-500 bg-sky-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
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

            {/* Preferred Pace */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's your preferred pace?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paceOptions.map((pace) => (
                  <button
                    key={pace.id}
                    type="button"
                    onClick={() => setFormData({...formData, pace: pace.id})}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.pace === pace.id
                        ? 'border-sky-500 bg-sky-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-3">{pace.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{pace.title}</h4>
                    <p className="text-sm text-gray-600">{pace.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* What Interests You */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What interests you?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {preferenceOptions.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      formData.preferences.includes(pref)
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected: {formData.preferences.length} preferences
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Any special requirements?</h2>
              <p className="text-gray-600">Help us make your trip accessible and comfortable</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements or Accessibility Needs
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                  placeholder="e.g., Wheelchair accessible rooms, vegetarian meals, guide assistance, medical needs..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Quick add common requirements:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonRequirements.map((req) => (
                    <button
                      key={req}
                      type="button"
                      onClick={() => addRequirement(req)}
                      className="p-2 text-sm border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-colors text-left"
                    >
                      + {req}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your planning style</h2>
              <p className="text-gray-600">How would you like to plan your trip?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Package Option */}
              <button
                onClick={selectAIPackage}
                className="p-8 rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 transition-all duration-200 text-left group hover:shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI-Curated Package</h3>
                    <p className="text-sky-600 font-medium">Recommended ✨</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Complete package in 2 minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Flights, hotels & activities included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Smart optimization & best deals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Based on your preferences</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Setup time: ~2 minutes</span>
                  <ArrowRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Custom Builder Option */}
              <button
                onClick={selectCustomBuilder}
                className="p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Build Custom Itinerary</h3>
                    <p className="text-gray-600">Full control</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Handpick every detail</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Compare all options yourself</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Unlimited customization</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Build at your own pace</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Setup time: ~15-30 minutes</span>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your AI-Curated Package</h2>
              <p className="text-gray-600">We've created the perfect trip based on your preferences</p>
              {isFromVoice && (
                <div className="mt-3 px-4 py-2 bg-sky-100 text-sky-800 rounded-lg inline-block">
                  🎤 Generated from your voice input
                </div>
              )}
            </div>

            {/* Package Summary */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-sky-600">7 Days</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">₹{(parseInt(formData.budget) || 150000).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">₹15,000</div>
                  <div className="text-sm text-gray-600">You Save</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{formData.travelers}</div>
                  <div className="text-sm text-gray-600">Travelers</div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              {/* Flight Package */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      ✈️
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Flight Package</h3>
                      <p className="text-sm text-gray-600">{formData.origin} ↔ {formData.destination}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹45,000</div>
                    <div className="text-sm text-green-600">Save ₹8,000</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Round-trip flights • Premium economy • 2 checked bags included
                </div>
              </div>

              {/* Hotel Package */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      🏨
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hotel Package</h3>
                      <p className="text-sm text-gray-600">Premium 4-star accommodation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹42,000</div>
                    <div className="text-sm text-green-600">Save ₹5,000</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  7 nights • Breakfast included • Free WiFi • City center location
                </div>
              </div>

              {/* Activities Package */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      🎭
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Activities Package</h3>
                      <p className="text-sm text-gray-600">Curated experiences based on your interests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹18,000</div>
                    <div className="text-sm text-green-600">Save ₹2,000</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {formData.preferences.slice(0, 3).join(', ')} • Skip-the-line tickets • Local guide
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            {formData.specialRequirements && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Special Requirements Included:</h4>
                <p className="text-sm text-blue-800">{formData.specialRequirements}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={bookPackage}
                className="flex-1 flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-sky-500/25"
              >
                <Sparkles className="w-5 h-5" />
                <span>Book This Package</span>
              </button>
              
              <button
                onClick={customizePackage}
                className="flex-1 flex items-center justify-center space-x-2 px-8 py-4 bg-white text-sky-600 font-semibold rounded-xl border-2 border-sky-200 hover:bg-sky-50 transition-all duration-200"
              >
                <Zap className="w-5 h-5" />
                <span>Customize Package</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show custom builder if active
  if (showCustomBuilder) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Custom Package</h1>
          <p className="text-gray-600">Select individual components for your perfect trip</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {builderStep === 'flight' && 'Step 1: Select Flight'}
              {builderStep === 'hotel' && 'Step 2: Select Hotel'}
              {builderStep === 'activities' && 'Step 3: Select Activities'}
              {builderStep === 'summary' && 'Step 4: Review & Book'}
            </span>
            <span className="text-sm text-gray-500">
              Total: ₹{customPackage.totalCost.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${
                  builderStep === 'flight' ? 25 :
                  builderStep === 'hotel' ? 50 :
                  builderStep === 'activities' ? 75 : 100
                }%` 
              }}
            />
          </div>
        </div>

        {/* Custom Builder Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {renderCustomBuilder()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCustomBuilder(false)}
                className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back to Packages
              </button>
              {builderStep !== 'flight' && (
                <button
                  onClick={prevBuilderStep}
                  className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {builderStep !== 'summary' && (
                <button
                  onClick={skipBuilderStep}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip (Optional)
                </button>
              )}
              {builderStep !== 'summary' && (
                <button
                  onClick={nextBuilderStep}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Trip</h1>
        <p className="text-gray-600">Let's plan your perfect journey together</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Next
              </button>
            ) : currentStep === 3 ? (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Continue to Planning
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};