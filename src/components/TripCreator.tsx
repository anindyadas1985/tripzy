import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, DollarSign, Zap, Clock, Heart, Briefcase, Baby } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';
import { SearchFilters } from '../types';

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
  const totalSteps = 4;

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
        // Clear the stored data
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
    
    // If from voice, go directly to AI package, otherwise show selection
    if (isFromVoice) {
      setCurrentStep(7); // Skip package selection, go to AI package
    } else {
      setCurrentStep(6); // Show package selection
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you going?</h2>
              <p className="text-gray-600">Tell us about your trip basics</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (USD)</label>
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your travel style?</h2>
              <p className="text-gray-600">This helps us customize your itinerary</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {styleOptions.map((style) => {
                const Icon = style.icon;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setFormData({...formData, style: style.id})}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                      formData.style === style.id
                        ? 'border-sky-500 bg-sky-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${style.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{style.title}</h3>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your preferred pace?</h2>
              <p className="text-gray-600">How many activities do you want per day?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paceOptions.map((pace) => (
                <button
                  key={pace.id}
                  type="button"
                  onClick={() => setFormData({...formData, pace: pace.id})}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                    formData.pace === pace.id
                      ? 'border-sky-500 bg-sky-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-4">{pace.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pace.title}</h3>
                  <p className="text-sm text-gray-600">{pace.description}</p>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };
};
