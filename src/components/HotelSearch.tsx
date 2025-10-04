import React, { useState } from 'react';
import { Search, Building, MapPin, Star, Wifi, Car, Coffee, Check } from 'lucide-react';

interface Hotel {
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

interface HotelSearchProps {
  onHotelSelect?: (hotel: Hotel) => void;
  selectedHotel?: Hotel | null;
  isCustomizing?: boolean;
}

export const HotelSearch: React.FC<HotelSearchProps> = ({ 
  onHotelSelect, 
  selectedHotel, 
  isCustomizing = false 
}) => {
  const [searchParams, setSearchParams] = useState({
    destination: 'Paris, France',
    checkIn: '2025-03-15',
    checkOut: '2025-03-22',
    guests: 2,
    rooms: 1
  });

  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Le Marais Boutique Hotel',
      location: '4th Arrondissement, Paris',
      rating: 4.8,
      price: 180,
      originalPrice: 220,
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      amenities: ['Free WiFi', 'Breakfast', 'Room Service'],
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      setTimeout(() => {
        setSearchResults(mockHotels);
        setIsSearching(false);
      }, 1500);
    } catch (error) {
      console.error('Hotel search error:', error);
      setIsSearching(false);
    }
  };

  const handleBookHotel = async (hotel: Hotel) => {
    if (isCustomizing && onHotelSelect) {
      onHotelSelect(hotel);
      return;
    }
    
    try {
      // Create a booking record
      const booking = {
        id: Date.now().toString(),
        tripId: 'current-trip',
        type: 'hotel' as const,
        title: hotel.name,
        provider: 'Booking.com',
        confirmationCode: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(),
        cost: hotel.price,
        status: 'confirmed' as const,
        details: {
          location: hotel.location,
          rating: hotel.rating,
          amenities: hotel.amenities.join(', '),
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
          guests: searchParams.guests,
          rooms: searchParams.rooms
        }
      };

      // Store booking in localStorage for demo
      const existingBookings = JSON.parse(localStorage.getItem('journai_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('journai_bookings', JSON.stringify(existingBookings));

      // Show success message
      alert(`Hotel booked successfully! Confirmation: ${booking.confirmationCode}`);
      
      // Navigate to bookings list
      window.dispatchEvent(new CustomEvent('navigate-to-booking'));
      
    } catch (error) {
      console.error('Hotel booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi': return <Wifi className="w-3 h-3" />;
      case 'parking': return <Car className="w-3 h-3" />;
      case 'breakfast': return <Coffee className="w-3 h-3" />;
      default: return <Building className="w-3 h-3" />;
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

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <input
            type="text"
            value={searchParams.destination}
            onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
            <select
              value={searchParams.guests}
              onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
            <select
              value={searchParams.rooms}
              onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
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
          <span>{isSearching ? 'Searching...' : 'Search Hotels'}</span>
        </button>
      </form>

      {/* Search Results */}
      {isSearching && (
        <div className="text-center py-12">
          <Building className="w-8 h-8 mx-auto text-sky-600 animate-bounce mb-4" />
          <p className="text-gray-600">Finding the perfect hotels...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Found {searchResults.length} hotels
          </h3>
          
          {searchResults.map((hotel) => (
            <div key={hotel.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                          ₹{hotel.originalPrice}/night
                        </div>
                      )}
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{hotel.price}<span className="text-sm font-normal">/night</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                    <span>•</span>
                    <span>{hotel.distance}</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    {hotel.amenities.slice(0, 4).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 text-sm text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <button className="text-sky-600 font-medium hover:text-sky-700">
                      View Details
                    </button>
                    {isCustomizing ? (
                      <button 
                        onClick={() => handleBookHotel(hotel)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                          selectedHotel?.id === hotel.id
                            ? 'bg-green-600 text-white'
                            : 'bg-sky-600 text-white hover:bg-sky-700'
                        }`}
                      >
                        {selectedHotel?.id === hotel.id ? (
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
                        onClick={() => handleBookHotel(hotel)}
                        className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-700 transition-colors"
                      >
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};