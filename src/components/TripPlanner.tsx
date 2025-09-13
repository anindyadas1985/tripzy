import React, { useState } from 'react';
import { SearchForm } from './SearchForm';
import { ItineraryBuilder } from './ItineraryBuilder';
import { OptimizationPanel } from './OptimizationPanel';
import { SearchFilters } from '../types';

export const TripPlanner: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [showItinerary, setShowItinerary] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setShowItinerary(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Perfect Trip</h1>
        <p className="text-gray-600">AI-powered itinerary optimization with real-time updates</p>
      </div>

      {!showItinerary ? (
        <SearchForm onSearch={handleSearch} />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <ItineraryBuilder filters={searchFilters!} />
          </div>
          <div className="xl:col-span-1">
            <OptimizationPanel />
          </div>
        </div>
      )}
    </div>
  );
};