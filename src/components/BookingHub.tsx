import React, { useState } from 'react';
import { FlightSearch } from './FlightSearch';
import { HotelSearch } from './HotelSearch';
import { BookingsList } from './BookingsList';
import { Plane, Building, List } from 'lucide-react';

export const BookingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'bookings'>('flights');

  const tabs = [
    { id: 'flights' as const, label: 'Flights', icon: Plane },
    { id: 'hotels' as const, label: 'Hotels', icon: Building },
    { id: 'bookings' as const, label: 'My Bookings', icon: List }
  ];

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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'flights' && (
            <FlightSearch 
              onFlightSelect={isCustomizing ? handleFlightSelection : undefined}
              selectedFlight={selectedFlight}
              isCustomizing={isCustomizing}
            />
          )}
          {activeTab === 'hotels' && (
            <HotelSearch 
              onHotelSelect={isCustomizing ? handleHotelSelection : undefined}
              selectedHotel={selectedHotel}
              isCustomizing={isCustomizing}
            />
          )}
          {activeTab === 'bookings' && <BookingsList />}
        </div>
        
        {/* Customization Confirmation */}
        {isCustomizing && selectedFlight && selectedHotel && (
          <div className="p-6 border-t border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Customization Complete!</h3>
                <p className="text-sm text-green-800">
                  Flight: {selectedFlight.airline} • Hotel: {selectedHotel.name}
                </p>
                <p className="text-sm text-green-700">
                  New Total: ${selectedFlight.price + (selectedHotel.price * 7)}
                </p>
              </div>
              <button
                onClick={handleConfirmCustomization}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                <Check className="w-5 h-5" />
                <span>Confirm Customization</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};