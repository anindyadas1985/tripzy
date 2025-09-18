import React, { useState } from 'react';
import { Search, Plane, Clock, DollarSign, ArrowRight, Check } from 'lucide-react';

interface Flight {
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

interface FlightSearchProps {
  onFlightSelect?: (flight: Flight) => void;
  selectedFlight?: Flight | null;
  isCustomizing?: boolean;
}

export const FlightSearch: React.FC<FlightSearchProps> = ({ 
  onFlightSelect, 
  selectedFlight, 
  isCustomizing = false 
}) => {
  const [searchParams, setSearchParams] = useState({
    from: 'New York (JFK)',
    to: 'Paris (CDG)',
    departDate: '2025-03-15',
    returnDate: '2025-03-22',
    passengers: 1,
    class: 'economy'
  });

  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockFlights: Flight[] = [
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      setSearchResults(mockFlights);
      setIsSearching(false);
    }, 1500);
  };

  const handleBookFlight = (flight: Flight) => {
    // Handle flight booking logic here
    console.log('Booking flight:', flight);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <input
              type="text"
              value={searchParams.from}
              onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <input
              type="text"
              value={searchParams.to}
              onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
            <input
              type="date"
              value={searchParams.departDate}
              onChange={(e) => setSearchParams({...searchParams, departDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
            <input
              type="date"
              value={searchParams.returnDate}
              onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <select
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full bg-sky-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>{isSearching ? 'Searching...' : 'Search Flights'}</span>
        </button>
      </form>

      {/* Search Results */}
      {isSearching && (
        <div className="text-center py-12">
          <Plane className="w-8 h-8 mx-auto text-sky-600 animate-bounce mb-4" />
          <p className="text-gray-600">Searching for the best flights...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Found {searchResults.length} flights
          </h3>
          
          {searchResults.map((flight) => (
            <div key={flight.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                  {isCustomizing ? (
                    <button 
                      onClick={() => handleBookFlight(flight)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                        selectedFlight?.id === flight.id
                          ? 'bg-green-600 text-white'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      {selectedFlight?.id === flight.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleBookFlight(flight)}
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};