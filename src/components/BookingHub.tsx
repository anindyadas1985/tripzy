import React, { useState } from 'react';
import { FlightSearch } from './FlightSearch';
import { HotelSearch } from './HotelSearch';
import { BookingsList } from './BookingsList';
import { Plane, Building, List } from 'lucide-react';

export const BookingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'bookings'>('flights');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizationData, setCustomizationData] = useState<any>(null);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [showCustomizationSummary, setShowCustomizationSummary] = useState(false);
  const [isBookingCustomization, setIsBookingCustomization] = useState(false);

  const tabs = [
    { id: 'flights' as const, label: 'Flights', icon: Plane },
    { id: 'hotels' as const, label: 'Hotels', icon: Building },
    { id: 'bookings' as const, label: 'My Bookings', icon: List }
  ];

  const handleConfirmCustomization = async () => {
    if (!selectedFlight || !selectedHotel || !customizationData) return;

    setIsBookingCustomization(true);

    try {
      // Calculate nights between dates
      const startDate = new Date(customizationData.tripData.startDate);
      const endDate = new Date(customizationData.tripData.endDate);
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Create flight booking
      const flightBooking = {
        id: Date.now().toString(),
        tripId: 'customized-trip',
        type: 'flight' as const,
        title: `${customizationData.tripData.origin} to ${customizationData.tripData.destination}`,
        provider: selectedFlight.airline,
        confirmationCode: `FL${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(customizationData.tripData.startDate),
        cost: selectedFlight.price,
        status: 'confirmed' as const,
        details: {
          departure: selectedFlight.departure.time,
          arrival: selectedFlight.arrival.time,
          duration: selectedFlight.duration,
          flightNumber: selectedFlight.flightNumber
        }
      };

      // Create hotel booking
      const hotelBooking = {
        id: (Date.now() + 1).toString(),
        tripId: 'customized-trip',
        type: 'hotel' as const,
        title: selectedHotel.name,
        provider: 'Booking.com',
        confirmationCode: `HT${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date(customizationData.tripData.startDate),
        cost: selectedHotel.price * nights,
        status: 'confirmed' as const,
        details: {
          location: selectedHotel.location,
          rating: selectedHotel.rating,
          nights: nights,
          checkIn: customizationData.tripData.startDate,
          checkOut: customizationData.tripData.endDate
        }
      };

      // Store bookings
      const existingBookings = JSON.parse(localStorage.getItem('journai_bookings') || '[]');
      existingBookings.push(flightBooking, hotelBooking);
      localStorage.setItem('journai_bookings', JSON.stringify(existingBookings));

      // Calculate total cost
      const totalCost = selectedFlight.price + (selectedHotel.price * nights);

      // Show success message
      alert(`🎉 Customized trip booked successfully!\n\nFlight: ${flightBooking.confirmationCode}\nHotel: ${hotelBooking.confirmationCode}\n\nTotal Cost: $${totalCost}`);

      // Clean up and navigate
      sessionStorage.removeItem('tripCustomizationData');
      setIsCustomizing(false);
      setCustomizationData(null);
      setSelectedFlight(null);
      setSelectedHotel(null);
      setShowCustomizationSummary(false);
      
      // Navigate to dashboard
      window.dispatchEvent(new CustomEvent('navigate-to-dashboard'));
      
    } catch (error) {
      console.error('Customization booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBookingCustomization(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Travel</h1>
        <p className="text-gray-600">Find and book the best flights, hotels, and activities</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600 bg-sky-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showCustomizationSummary ? (
            renderCustomizationSummary()
          ) : (
            <>
              {activeTab === 'flights' && <FlightSearch 
                onFlightSelect={isCustomizing ? handleFlightSelect : undefined}
                selectedFlight={selectedFlight}
                isCustomizing={isCustomizing}
              />}
              {activeTab === 'hotels' && <HotelSearch 
                onHotelSelect={isCustomizing ? handleHotelSelect : undefined}
                selectedHotel={selectedHotel}
                isCustomizing={isCustomizing}
              />}
              {activeTab === 'bookings' && <BookingsList />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};