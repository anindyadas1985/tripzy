import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Sparkles, MapPin, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface VoiceTranscript {
  text: string;
  isListening: boolean;
  confidence: number;
}

interface ParsedTripData {
  destination?: string;
  origin?: string;
  duration?: string;
  travelers?: number;
  budget?: string;
  interests?: string[];
  dates?: {
    start?: string;
    end?: string;
  };
  style?: 'leisure' | 'business' | 'family';
  pace?: 'relaxed' | 'moderate' | 'packed';
}

export const VoiceTripPlanner: React.FC = () => {
  const { createTrip, setActiveTrip } = useTripContext();
  const [transcript, setTranscript] = useState<VoiceTranscript>({
    text: '',
    isListening: false,
    confidence: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTripData | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => ({
          ...prev,
          text: finalTranscript || interimTranscript,
          confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0
        }));
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setTranscript(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current.onend = () => {
        setTranscript(prev => ({ ...prev, isListening: false }));
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !transcript.isListening) {
      setTranscript(prev => ({ ...prev, isListening: true, text: '' }));
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && transcript.isListening) {
      recognitionRef.current.stop();
      setTranscript(prev => ({ ...prev, isListening: false }));
    }
  };

  const clearTranscript = () => {
    setTranscript({ text: '', isListening: false, confidence: 0 });
    setParsedData(null);
    setGeneratedItinerary([]);
    setShowResults(false);
  };

  const parseVoiceInput = (text: string): ParsedTripData => {
    const parsed: ParsedTripData = {};
    const lowerText = text.toLowerCase();

    // Extract destination
    const destinationPatterns = [
      /(?:to|visit|go to|travel to|trip to)\s+([a-zA-Z\s,]+?)(?:\s|$|for|in|during|with)/,
      /(?:want to go to|planning to visit|heading to)\s+([a-zA-Z\s,]+?)(?:\s|$|for|in|during|with)/
    ];
    
    for (const pattern of destinationPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        parsed.destination = match[1].trim().replace(/\b\w/g, l => l.toUpperCase());
        break;
      }
    }

    // Extract origin
    const originPatterns = [
      /(?:from|starting from|leaving from)\s+([a-zA-Z\s,]+?)(?:\s|$|to|for|in|during)/
    ];
    
    for (const pattern of originPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        parsed.origin = match[1].trim().replace(/\b\w/g, l => l.toUpperCase());
        break;
      }
    }

    // Extract duration
    const durationPatterns = [
      /(?:for|during)\s+(\d+)\s+(?:days?|weeks?)/,
      /(\d+)\s+(?:day|week)\s+(?:trip|vacation|holiday)/
    ];
    
    for (const pattern of durationPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        parsed.duration = match[1] + ' days';
        break;
      }
    }

    // Extract number of travelers
    const travelerPatterns = [
      /(?:with|for)\s+(\d+)\s+(?:people|persons|travelers|friends|family)/,
      /(\d+)\s+(?:of us|people|travelers)/,
      /(?:group of|party of)\s+(\d+)/
    ];
    
    for (const pattern of travelerPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        parsed.travelers = parseInt(match[1]);
        break;
      }
    }

    // Extract budget
    const budgetPatterns = [
      /budget\s+(?:of|is|around)\s+(?:\$|₹|rs\.?)\s*(\d+(?:,\d+)*(?:k|thousand|lakh)?)/,
      /(?:\$|₹|rs\.?)\s*(\d+(?:,\d+)*(?:k|thousand|lakh)?)\s+budget/
    ];
    
    for (const pattern of budgetPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        parsed.budget = match[1];
        break;
      }
    }

    // Extract interests/activities
    const interests = [];
    const interestKeywords = [
      'museums', 'art', 'culture', 'food', 'dining', 'restaurants', 'adventure', 'sports',
      'beaches', 'mountains', 'hiking', 'photography', 'shopping', 'nightlife', 'history',
      'architecture', 'nature', 'parks', 'sightseeing', 'relaxation', 'spa'
    ];

    interestKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        interests.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    if (interests.length > 0) {
      parsed.interests = interests;
    }

    // Determine trip style
    if (lowerText.includes('business') || lowerText.includes('work') || lowerText.includes('conference')) {
      parsed.style = 'business';
    } else if (lowerText.includes('family') || lowerText.includes('kids') || lowerText.includes('children')) {
      parsed.style = 'family';
    } else {
      parsed.style = 'leisure';
    }

    // Determine pace
    if (lowerText.includes('relaxed') || lowerText.includes('slow') || lowerText.includes('peaceful')) {
      parsed.pace = 'relaxed';
    } else if (lowerText.includes('packed') || lowerText.includes('busy') || lowerText.includes('lots of')) {
      parsed.pace = 'packed';
    } else {
      parsed.pace = 'moderate';
    }

    return parsed;
  };

  const generateItinerary = async () => {
    if (!transcript.text.trim()) return;

    setIsProcessing(true);
    
    // Parse the voice input
    const parsed = parseVoiceInput(transcript.text);
    setParsedData(parsed);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock itinerary based on parsed data
    const mockItinerary = [
      {
        id: '1',
        day: 1,
        title: `Arrival in ${parsed.destination || 'Destination'}`,
        activities: [
          {
            time: '10:00 AM',
            activity: 'Airport pickup and hotel check-in',
            location: 'Hotel',
            duration: '2 hours'
          },
          {
            time: '2:00 PM',
            activity: 'Local area exploration and lunch',
            location: 'City Center',
            duration: '3 hours'
          },
          {
            time: '7:00 PM',
            activity: 'Welcome dinner at local restaurant',
            location: 'Restaurant',
            duration: '2 hours'
          }
        ]
      },
      {
        id: '2',
        day: 2,
        title: 'City Sightseeing',
        activities: [
          {
            time: '9:00 AM',
            activity: 'Visit main attractions and landmarks',
            location: 'Tourist Sites',
            duration: '4 hours'
          },
          {
            time: '2:00 PM',
            activity: parsed.interests?.includes('Museums') ? 'Museum visit' : 'Cultural experience',
            location: 'Cultural Site',
            duration: '3 hours'
          },
          {
            time: '7:00 PM',
            activity: parsed.interests?.includes('Food') ? 'Food tour' : 'Local dining experience',
            location: 'Local Area',
            duration: '2 hours'
          }
        ]
      }
    ];

    setGeneratedItinerary(mockItinerary);
    setShowResults(true);
    setIsProcessing(false);
  };

  const createTripFromVoice = () => {
    if (!parsedData) return;

    const tripData = {
      title: `${parsedData.origin || 'My'} to ${parsedData.destination || 'Dream Destination'} Trip`,
      origin: parsedData.origin || 'Your City',
      destination: parsedData.destination || 'Dream Destination',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      travelers: parsedData.travelers || 1,
      budget: parsedData.budget ? parseInt(parsedData.budget.replace(/[^\d]/g, '')) : 50000,
      style: parsedData.style || 'leisure',
      pace: parsedData.pace || 'moderate',
      preferences: parsedData.interests || []
    };

    // Store voice data for Create Trip form
    localStorage.setItem('voiceTripData', JSON.stringify(tripData));
    
    // Navigate to Create Trip for additional input
    window.dispatchEvent(new CustomEvent('navigate-to-create'));
  };

  if (!isSupported) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <MicOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Input Not Supported</h2>
          <p className="text-gray-600">
            Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voice Trip Planner</h1>
            <h1 className="text-3xl font-bold text-gray-900">Speak & Go</h1>
            <p className="text-gray-600">Just speak your travel dreams, and we'll create the perfect itinerary</p>
          </div>
        </div>

        {/* Example prompts */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Try saying something like:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="bg-white/60 rounded-lg p-3">
              "I want to go to Paris from Delhi for 7 days with my family, budget around 2 lakhs, interested in museums and food"
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              "Planning a business trip to Tokyo for 5 days, leaving from Mumbai, need packed schedule"
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              "Relaxed vacation to Goa with 3 friends, love beaches and nightlife, 1 lakh budget"
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              "Family trip to Kerala for 10 days, interested in nature and culture, moderate pace"
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🎤 Voice Input</h2>

          {/* Microphone Control */}
          <div className="text-center mb-6">
            <button
              onClick={transcript.isListening ? stopListening : startListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                transcript.isListening
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/25 animate-pulse'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25'
              }`}
            >
              {transcript.isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
            
            <p className="mt-4 text-sm text-gray-600">
              {transcript.isListening ? 'Listening... Speak now!' : 'Click to start speaking'}
            </p>
            
            {transcript.confidence > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-500">
                  Confidence: {Math.round(transcript.confidence * 100)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${transcript.confidence * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Transcript Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Speech:</label>
            <div className="min-h-[120px] p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              {transcript.text ? (
                <p className="text-gray-900 leading-relaxed">{transcript.text}</p>
              ) : (
                <p className="text-gray-500 italic">Your speech will appear here...</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={generateItinerary}
              disabled={!transcript.text.trim() || isProcessing}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isProcessing ? 'Processing...' : 'Generate Itinerary'}</span>
            </button>
            
            <button
              onClick={clearTranscript}
              className="px-4 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🤖 AI Analysis</h2>

          {isProcessing && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600">Analyzing your travel preferences...</p>
            </div>
          )}

          {parsedData && !isProcessing && (
            <div className="space-y-6">
              {/* Parsed Information */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">📋 Extracted Information:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {parsedData.destination && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span><strong>Destination:</strong> {parsedData.destination}</span>
                    </div>
                  )}
                  {parsedData.origin && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span><strong>From:</strong> {parsedData.origin}</span>
                    </div>
                  )}
                  {parsedData.duration && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span><strong>Duration:</strong> {parsedData.duration}</span>
                    </div>
                  )}
                  {parsedData.travelers && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span><strong>Travelers:</strong> {parsedData.travelers}</span>
                    </div>
                  )}
                  {parsedData.budget && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span><strong>Budget:</strong> ₹{parsedData.budget}</span>
                    </div>
                  )}
                  {parsedData.style && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-sky-600" />
                      <span><strong>Style:</strong> {parsedData.style}</span>
                    </div>
                  )}
                </div>
                
                {parsedData.interests && parsedData.interests.length > 0 && (
                  <div className="mt-3">
                    <strong className="text-sm">Interests:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {parsedData.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Itinerary Preview */}
              {showResults && generatedItinerary.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🗓️ Generated Itinerary Preview:</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {generatedItinerary.map((day) => (
                      <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Day {day.day}: {day.title}</h4>
                        <div className="space-y-2">
                          {day.activities.map((activity: any, index: number) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                              <span className="text-sky-600 font-medium">{activity.time}</span>
                              <div>
                                <div className="text-gray-900">{activity.activity}</div>
                                <div className="text-gray-500">{activity.location} • {activity.duration}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={createTripFromVoice}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Create This Trip</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {!parsedData && !isProcessing && (
            <div className="text-center py-12 text-gray-500">
              <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Start speaking to see AI analysis here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};